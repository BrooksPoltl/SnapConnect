/**
 * Deno-based Supabase Edge Function for querying a RAG model.
 * Handles Pinecone vector search and OpenAI chat completion.
 */

import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { corsHeaders } from '../_shared/cors.ts';

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
      `https://${pineconeIndexName}-${pineconeEnvironment}.svc.pinecone.io/query`,
      {
        method: 'POST',
        headers: {
          'Api-Key': pineconeApiKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          vector: queryVector,
          topK: 5,
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
      .map(match => match.metadata?.text || '')
      .filter(text => text.length > 0)
      .join('\\n\\n');

    const sources = relevantDocs
      .map(match => match.metadata?.source_url || '')
      .filter(url => url.length > 0);

    // Step 3: Generate response using OpenAI with context
    const systemPrompt = `You are a financial AI assistant with access to SEC filing data. Use the provided context from EDGAR filings to answer the user's question accurately and concisely.

    Context from SEC filings:
    ${context}

    Instructions:
    - Base your response primarily on the provided context
    - Be specific and cite relevant financial metrics when available
    - If the context doesn't contain enough information, say so
    - Keep responses focused and under 200 words
    - Use a professional but conversational tone`;

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
        max_tokens: 300,
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

    await supabaseClient.rpc('add_ai_message', {
      conversation_uuid: finalConversationId,
      message_sender: 'user',
      message_content: prompt,
    });

    await supabaseClient.rpc('add_ai_message', {
      conversation_uuid: finalConversationId,
      message_sender: 'ai',
      message_content: aiResponse,
      metadata: { sources },
    });

    return new Response(
      JSON.stringify({ response: aiResponse, sources, conversationId: finalConversationId }),
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
