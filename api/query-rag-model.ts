/**
 * Node.js TypeScript API endpoint for querying the RAG model
 * Handles Pinecone vector search and OpenAI chat completion
 */

import { Request, Response } from 'express';
import { createClient } from '@supabase/supabase-js';

interface QueryRequest {
  prompt: string;
  conversationId?: string;
}

interface QueryResponse {
  response: string;
  sources?: string[];
  conversationId: string;
}

export default async function handler(req: Request, res: Response) {
  // Handle CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'authorization, x-client-info, apikey, content-type',
  );
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get the authorization header from the request
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: 'Authorization header required' });
    }

    const supabaseClient = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_ANON_KEY!, {
      global: { headers: { Authorization: authHeader } },
    });

    // Get the user from the auth header
    const {
      data: { user },
      error: userError,
    } = await supabaseClient.auth.getUser();
    if (userError || !user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { prompt, conversationId }: QueryRequest = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    // Step 1: Generate embeddings for the user's prompt
    const openaiApiKey = process.env.OPENAI_API_KEY;
    if (!openaiApiKey) {
      return res.status(500).json({ error: 'OpenAI API key not configured' });
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
      return res.status(500).json({ error: 'Failed to generate embeddings' });
    }

    const embeddingData = await embeddingResponse.json();
    const queryVector = embeddingData.data[0].embedding;

    // Step 2: Query Pinecone for relevant context
    const pineconeApiKey = process.env.PINECONE_API_KEY;
    const pineconeEnvironment = process.env.PINECONE_ENVIRONMENT;
    const pineconeIndexName = process.env.PINECONE_INDEX_NAME;

    if (!pineconeApiKey || !pineconeEnvironment || !pineconeIndexName) {
      return res.status(500).json({ error: 'Pinecone configuration missing' });
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
      return res.status(500).json({ error: 'Failed to query Pinecone' });
    }

    const pineconeData = await pineconeResponse.json();
    const relevantDocs = pineconeData.matches || [];

    // Step 3: Prepare context from retrieved documents
    const context = relevantDocs
      .map((match: any) => match.metadata?.text || '')
      .filter((text: string) => text.length > 0)
      .join('\n\n');

    const sources = relevantDocs
      .map((match: any) => match.metadata?.source_url || '')
      .filter((url: string) => url.length > 0);

    // Step 4: Generate response using OpenAI with context
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
      return res.status(500).json({ error: 'Failed to generate AI response' });
    }

    const chatData = await chatResponse.json();
    const aiResponse =
      chatData.choices[0]?.message?.content || 'I apologize, but I could not generate a response.';

    // Step 5: Handle conversation persistence
    let finalConversationId = conversationId;

    if (!conversationId) {
      // Create new conversation
      const { data: newConversation, error: conversationError } = await supabaseClient.rpc(
        'create_ai_conversation',
        { conversation_title: 'untitled conversation' },
      );

      if (conversationError) {
        console.error('Error creating conversation:', conversationError);
        return res.status(500).json({ error: 'Failed to create conversation' });
      }

      finalConversationId = newConversation;
    }

    // Add user message
    const { error: userMessageError } = await supabaseClient.rpc('add_ai_message', {
      conversation_uuid: finalConversationId,
      message_sender: 'user',
      message_content: prompt,
    });

    if (userMessageError) {
      console.error('Error adding user message:', userMessageError);
    }

    // Add AI response
    const { error: aiMessageError } = await supabaseClient.rpc('add_ai_message', {
      conversation_uuid: finalConversationId,
      message_sender: 'ai',
      message_content: aiResponse,
    });

    if (aiMessageError) {
      console.error('Error adding AI message:', aiMessageError);
    }

    const response: QueryResponse = {
      response: aiResponse,
      sources: sources.length > 0 ? Array.from(new Set(sources)) : undefined,
      conversationId: finalConversationId!,
    };

    return res.status(200).json(response);
  } catch (error) {
    console.error('Error in query-rag-model function:', error);
    return res.status(500).json({
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
