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
            content: 'You are an expert at analyzing satellite images of roofs. For the given satellite image, identify the main roof outline and return the coordinates that form a closed polygon around it. Return ONLY a JSON array in the format [[lat1,lng1], [lat2,lng2], ...] with no additional text.'
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
        temperature: 0,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenAI API error:', errorText);
      throw new Error('Failed to get response from OpenAI');
    }

    const data = await response.json();
    console.log('OpenAI raw response:', JSON.stringify(data));

    // Check for the expected response structure
    if (!data.choices?.[0]?.message?.content) {
      throw new Error('Unexpected response structure from OpenAI');
    }

    let content = data.choices[0].message.content.trim();
    console.log('Content to parse:', content);

    // Try to parse the coordinates
    let coordinates;
    try {
      // First, try to extract just the JSON array if there's additional text
      const jsonMatch = content.match(/\[\s*\[.*?\]\s*\]/s);
      if (jsonMatch) {
        content = jsonMatch[0];
      }

      coordinates = JSON.parse(content);

      // Validate the coordinates array
      if (!Array.isArray(coordinates)) {
        throw new Error('Response is not an array');
      }

      if (coordinates.length < 3) {
        throw new Error('Need at least 3 points for a polygon');
      }

      // Validate each coordinate pair
      coordinates.forEach((coord, index) => {
        if (!Array.isArray(coord) || coord.length !== 2 ||
            typeof coord[0] !== 'number' || typeof coord[1] !== 'number') {
          throw new Error(`Invalid coordinate at index ${index}`);
        }
      });

      // Ensure the polygon is closed
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

    console.log('Final parsed coordinates:', coordinates);

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