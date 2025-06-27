/**
 * Deno-based Supabase Edge Function for querying a RAG model.
 * Handles Pinecone vector search and OpenAI chat completion.
 */

import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async req => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Authorization header required' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 401,
      });
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: authHeader } } },
    );

    const {
      data: { user },
      error: userError,
    } = await supabaseClient.auth.getUser();
    if (userError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 401,
      });
    }

    const { prompt, conversationId } = await req.json();

    if (!prompt) {
      return new Response(JSON.stringify({ error: 'Prompt is required' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      });
    }

    // Step 1: Generate embeddings for the user's prompt
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openaiApiKey) {
      return new Response(JSON.stringify({ error: 'OpenAI API key not configured' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      });
    }

    const embeddingResponse = await fetch('https://api.openai.com/v1/embeddings', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'text-embedding-3-small',
        input: prompt,
      }),
    });

    if (!embeddingResponse.ok) {
      const errorBody = await embeddingResponse.text();
      console.error('Failed to generate embeddings:', errorBody);
      return new Response(JSON.stringify({ error: 'Failed to generate embeddings' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      });
    }

    const embeddingData = await embeddingResponse.json();
    const queryVector = embeddingData.data[0].embedding;

    // Step 2: Query Pinecone for relevant context
    const pineconeApiKey = Deno.env.get('PINECONE_API_KEY');
    const pineconeEnvironment = Deno.env.get('PINECONE_ENVIRONMENT');
    const pineconeIndexName = Deno.env.get('PINECONE_INDEX_NAME');

    if (!pineconeApiKey || !pineconeEnvironment || !pineconeIndexName) {
      return new Response(JSON.stringify({ error: 'Pinecone configuration missing' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      });
    }

    const pineconeResponse = await fetch(
      `https://${pineconeIndexName}-${pineconeEnvironment}.pinecone.io/query`,
      {
        method: 'POST',
        headers: {
          'Api-Key': pineconeApiKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          vector: queryVector,
          topK: 20,
          includeMetadata: true,
          includeValues: false,
        }),
      },
    );

    if (!pineconeResponse.ok) {
      const errorBody = await pineconeResponse.text();
      console.error('Failed to query Pinecone:', errorBody);
      return new Response(JSON.stringify({ error: 'Failed to query Pinecone' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      });
    }

    const pineconeData = await pineconeResponse.json();
    const relevantDocs = pineconeData.matches || [];

    const context = relevantDocs
      .map(match => {
        const text = match.metadata?.text || '';
        const company = match.metadata?.company || 'Unknown Company';
        
        if (text.length > 0) {
          return `[${company} Filing]\n${text}`;
        }
        return '';
      })
      .filter(text => text.length > 0)
      .join('\\n\\n');

    const sources = relevantDocs
      .map(match => {
        // Log metadata to debug what fields are available
        console.log('Match metadata:', JSON.stringify(match.metadata, null, 2));
        
        const cik = match.metadata?.cik || match.metadata?.CIK;
        const accessionNumber = match.metadata?.accession_number || match.metadata?.accessionNumber;
        
        if (cik && accessionNumber) {
          // Remove dashes from accession number for URL
          const cleanAccessionNumber = accessionNumber.replace(/-/g, '');
          const url = `https://www.sec.gov/Archives/edgar/data/${cik}/${cleanAccessionNumber}/`;
          return url;
        }
        return '';
      });
    const nonEmptySources = sources.filter(url => url.length > 0);
    
    // Remove duplicate URLs
    const filteredSources = [...new Set(nonEmptySources)];

    // Step 3: Generate response using OpenAI with context
    const systemPrompt = `You are an emotionally intelligent financial AI assistant that reads between the lines of SEC filings to provide sentiment-aware analysis. You understand that markets are driven by both data and human psychology.

    Context from SEC filings (each section is labeled with the specific company):
    ${context}

    Instructions:
    - Extract both factual data AND emotional undertones from the filings
    - Identify management confidence levels, risk concerns, and forward-looking sentiment for each company
    - Assess whether each company's narrative matches their numbers
    - Reference specific companies by name when discussing their filing data
    - If asked for specific companies, list them clearly with brief explanations of why they're relevant
    - Use conversational language that acknowledges market emotions while staying data-driven
    - Limit responses to 200 words`;

    const chatResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: prompt },
        ],
        max_tokens: 2000,
        temperature: 0.7,
      }),
    });

    if (!chatResponse.ok) {
      const errorBody = await chatResponse.text();
      console.error('Failed to generate AI response:', errorBody);
      return new Response(JSON.stringify({ error: 'Failed to generate AI response' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      });
    }

    const chatData = await chatResponse.json();
    const aiResponse =
      chatData.choices[0]?.message?.content || 'I apologize, but I could not generate a response.';

    // Step 4: Handle conversation persistence
    let finalConversationId = conversationId;

    if (!conversationId) {
      const { data: newConversation, error: conversationError } = await supabaseClient.rpc(
        'create_ai_conversation',
        { conversation_title: 'untitled conversation' },
      );

      if (conversationError) {
        console.error('Error creating conversation:', conversationError);
        return new Response(JSON.stringify({ error: 'Failed to create conversation' }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500,
        });
      }
      finalConversationId = newConversation;
    }

    const { error: userMessageError } = await supabaseClient.rpc('add_ai_message', {
      conversation_uuid: finalConversationId,
      message_sender: 'user',
      message_content: prompt,
    });
    
    if (userMessageError) {
      console.error('Error storing user message:', userMessageError);
    }

    // Always include metadata, even if sources is empty
    const messageMetadata = { 
      sources: filteredSources,
      timestamp: new Date().toISOString()
    };
    
    console.log('Storing AI message with metadata:', JSON.stringify(messageMetadata));
    
    const { error: aiMessageError } = await supabaseClient.rpc('add_ai_message', {
      conversation_uuid: finalConversationId,
      message_sender: 'ai',
      message_content: aiResponse,
      message_metadata: messageMetadata,
    });
    
    if (aiMessageError) {
      console.error('Error storing AI message:', aiMessageError);
    }

    return new Response(
      JSON.stringify({ response: aiResponse, sources: filteredSources, conversationId: finalConversationId }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    );
  } catch (error) {
    console.error('Main error handler:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});
