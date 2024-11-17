import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { imageUrl } = await req.json();

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: 'Du bist ein Experte für die Analyse von Satellitenbildern von Dächern. Gib die Koordinaten der Dachkanten als Array von Koordinaten zurück, z.B. [[lat1,lng1], [lat2,lng2], ...]'
          },
          {
            role: 'user',
            content: [
              {
                type: 'image',
                image_url: imageUrl,
              },
              {
                type: 'text',
                text: 'Analysiere dieses Satellitenbild und gib mir die Koordinaten der Dachkanten zurück.',
              },
            ],
          },
        ],
        max_tokens: 500,
      }),
    });

    const data = await response.json();
    console.log('OpenAI Response:', data);

    return new Response(JSON.stringify({ 
      coordinates: data.choices[0].message.content 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});