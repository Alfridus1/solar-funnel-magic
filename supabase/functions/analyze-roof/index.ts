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
    const { imageUrl, location } = await req.json();
    
    if (!imageUrl) {
      throw new Error('Image URL is required');
    }

    console.log('Analyzing satellite image at location:', location);

    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      console.error('OpenAI API key not configured');
      throw new Error('OpenAI API key not configured');
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `You are a roof analysis expert specialized in identifying building outlines from satellite imagery. 
            
Instructions:
1. The image shows a satellite view of a building at coordinates ${location?.lat}, ${location?.lng} with zoom level ${location?.zoom}
2. Focus on finding the main building structure in the center of the image
3. Look for clear geometric shapes that indicate roof edges - these often appear as sharp contrasts in the satellite image
4. Identify the corners of the main roof structure, paying attention to shadows and color changes that indicate roof boundaries
5. Return coordinates as a closed polygon (first and last point must be identical)

Response format:
- Return ONLY a JSON object with either coordinates array or error message
- For successful detection: {"coordinates":[[lat1,lng1],[lat2,lng2],[lat3,lng3],[lat1,lng1]]}
- For failed detection: {"error":"Could not identify roof"}

Important rules:
- Coordinates must be numbers (latitude and longitude)
- The polygon must be closed (first and last points must match)
- Focus on the largest visible roof structure
- Ignore smaller attachments or extensions
- If multiple buildings are visible, focus on the most prominent one in the center
- If the image is unclear or no clear roof is visible, return the error message`
          },
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: 'Please analyze this satellite image and identify the roof outline of the main building.',
              },
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

    try {
      const parsedContent = JSON.parse(content);
      
      if (parsedContent.error) {
        console.log('AI reported error:', parsedContent.error);
        return new Response(
          JSON.stringify({ error: parsedContent.error }), 
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      if (!parsedContent.coordinates || !Array.isArray(parsedContent.coordinates)) {
        throw new Error('Invalid response format from AI');
      }

      const coordinates = parsedContent.coordinates;

      if (coordinates.length < 3) {
        throw new Error('Not enough points to form a polygon');
      }

      const validCoordinates = coordinates.every((coord: any) => 
        Array.isArray(coord) && 
        coord.length === 2 &&
        typeof coord[0] === 'number' && 
        typeof coord[1] === 'number'
      );

      if (!validCoordinates) {
        throw new Error('Invalid coordinate format in AI response');
      }

      const first = coordinates[0];
      const last = coordinates[coordinates.length - 1];
      if (first[0] !== last[0] || first[1] !== last[1]) {
        coordinates.push([...first]);
      }

      return new Response(
        JSON.stringify({ coordinates }), 
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );

    } catch (error) {
      console.error('Failed to parse AI response:', error);
      console.error('Raw content that failed to parse:', content);
      throw new Error('Failed to parse AI response');
    }
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