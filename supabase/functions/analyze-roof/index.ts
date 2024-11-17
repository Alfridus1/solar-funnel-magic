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
            content: 'You are an expert at analyzing satellite images of roofs. When given a satellite image, identify the roof outline and return a JSON array of coordinates in the format [[lat1,lng1], [lat2,lng2], ...]. The coordinates should form a closed polygon around the main roof structure. Return ONLY the coordinate array, no additional text.'
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
                text: 'Analyze this roof and return its coordinates as a JSON array.',
              },
            ],
          },
        ],
        max_tokens: 1000,
        temperature: 0,
      }),
    });

    if (!response.ok) {
      console.error('OpenAI API error:', await response.text());
      throw new Error('Failed to get response from OpenAI');
    }

    const data = await response.json();
    console.log('Raw OpenAI Response:', JSON.stringify(data));

    if (!data.choices?.[0]?.message?.content) {
      console.error('Invalid response structure:', data);
      throw new Error('Invalid response from OpenAI');
    }

    let content = data.choices[0].message.content.trim();
    console.log('Content before parsing:', content);

    // Try to extract just the JSON array if there's additional text
    const jsonMatch = content.match(/\[\s*\[.*?\]\s*\]/s);
    if (jsonMatch) {
      content = jsonMatch[0];
    }

    let coordinates;
    try {
      coordinates = JSON.parse(content);
      
      if (!Array.isArray(coordinates) || coordinates.length < 3) {
        throw new Error('Invalid polygon: needs at least 3 points');
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
        coordinates.push([...first]); // Close the polygon
      }
    } catch (error) {
      console.error('Coordinate parsing error:', error);
      console.error('Content that failed to parse:', content);
      throw new Error(`Failed to parse coordinates: ${error.message}`);
    }

    console.log('Final coordinates:', coordinates);

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