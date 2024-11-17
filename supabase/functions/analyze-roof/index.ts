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
    
    if (!imageUrl) {
      throw new Error('Image URL is required');
    }

    console.log('Analyzing image:', imageUrl);

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4-vision-preview',
        messages: [
          {
            role: 'system',
            content: 'You are an expert at analyzing satellite images of roofs. Given a satellite image, identify the roof outline and return ONLY a JSON array of coordinates representing the roof edges, in the format [[lat1,lng1], [lat2,lng2], ...]. The response should contain nothing but the coordinate array.'
          },
          {
            role: 'user',
            content: [
              {
                type: 'image_url',
                image_url: imageUrl,
              },
              {
                type: 'text',
                text: 'Return the coordinates of this roof as a JSON array.',
              },
            ],
          },
        ],
        max_tokens: 1000,
        temperature: 0.2,
      }),
    });

    const data = await response.json();
    console.log('Raw OpenAI Response:', JSON.stringify(data));

    if (!data.choices?.[0]?.message?.content) {
      console.error('Invalid OpenAI response structure:', data);
      throw new Error('Invalid response structure from OpenAI');
    }

    const content = data.choices[0].message.content.trim();
    console.log('OpenAI Response Content:', content);

    // Try to extract JSON array from the response
    let coordinates;
    try {
      // First try direct JSON parse
      coordinates = JSON.parse(content);
      
      // Verify it's an array of coordinate pairs
      if (!Array.isArray(coordinates) || !coordinates.every(coord => 
        Array.isArray(coord) && coord.length === 2 && 
        typeof coord[0] === 'number' && typeof coord[1] === 'number')) {
        throw new Error('Response is not in the correct coordinate format');
      }
    } catch (error) {
      console.error('Failed to parse coordinates:', error);
      throw new Error('Failed to parse roof coordinates from AI response');
    }

    console.log('Parsed coordinates:', coordinates);

    return new Response(
      JSON.stringify({ coordinates }), 
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error in analyze-roof function:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: 'Failed to analyze roof. Please try again.' 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});