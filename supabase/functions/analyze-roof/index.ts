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

    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      console.error('OpenAI API key not configured');
      throw new Error('OpenAI API key not configured');
    }

    console.log('Making request to OpenAI API...');
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4-vision-preview',
        messages: [
          {
            role: 'system',
            content: 'You are a roof analysis expert. Given a satellite image, identify the main roof outline and return coordinates in this exact format: {"coordinates": [[lat1,lng1], [lat2,lng2], ...]}. Each coordinate must be a number, and the polygon must be closed (first and last points must match).'
          },
          {
            role: 'user',
            content: [
              {
                type: 'image_url',
                image_url: {
                  url: imageUrl,
                }
              }
            ],
          },
        ],
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenAI API error response:', errorText);
      throw new Error(`OpenAI API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log('OpenAI response:', JSON.stringify(data));

    if (!data.choices?.[0]?.message?.content) {
      throw new Error('Unexpected response structure from OpenAI');
    }

    let content = data.choices[0].message.content.trim();
    console.log('Content to parse:', content);

    let coordinates;
    try {
      const parsedContent = JSON.parse(content);
      
      if (!parsedContent.coordinates || !Array.isArray(parsedContent.coordinates)) {
        throw new Error('Response must contain a coordinates array');
      }

      coordinates = parsedContent.coordinates;

      // Validate coordinates
      if (coordinates.length < 3) {
        throw new Error('Need at least 3 points for a polygon');
      }

      coordinates.forEach((coord, index) => {
        if (!Array.isArray(coord) || coord.length !== 2 ||
            typeof coord[0] !== 'number' || typeof coord[1] !== 'number') {
          throw new Error(`Invalid coordinate at index ${index}`);
        }
      });

      // Ensure polygon is closed
      const first = coordinates[0];
      const last = coordinates[coordinates.length - 1];
      if (first[0] !== last[0] || first[1] !== last[1]) {
        coordinates.push([...first]);
      }

    } catch (error) {
      console.error('Failed to parse coordinates:', error);
      console.error('Content that failed to parse:', content);
      throw new Error(`Invalid coordinate format: ${error.message}`);
    }

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