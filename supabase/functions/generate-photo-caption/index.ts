import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { corsHeaders } from '../_shared/cors.ts';
import { OpenAI } from 'https://deno.land/x/openai@v4.52.7/mod.ts';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: Deno.env.get('OPENAI_API_KEY'),
});

serve(async req => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { image } = await req.json();

    if (!image) {
      return new Response(JSON.stringify({ error: 'Image data is required' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      });
    }

    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: 'Generate a short, snappy caption for this image. The caption should be suitable for a social media post. Do not include hashtags or emojis.',
            },
            {
              type: 'image_url',
              image_url: {
                url: image,
                detail: 'low',
              },
            },
          ],
        },
      ],
      max_tokens: 50,
    });

    const caption = response.choices[0].message.content?.trim();

    return new Response(JSON.stringify({ caption }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});
