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
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: `You are a roof analysis expert. When given a satellite image, analyze it and return ONLY a JSON object containing coordinates for the roof outline. 
            The response must be in this exact format, with no additional text:
            {"coordinates":[[lat1,lng1],[lat2,lng2],[lat3,lng3],[lat1,lng1]]}
            
            Rules:
            1. Return ONLY valid JSON, no explanatory text
            2. Each coordinate must be a number
            3. The polygon must be closed (first and last points must match)
            4. If you cannot identify the roof, return exactly: {"error":"Could not identify roof"}
            
            Example of valid response:
            {"coordinates":[[52.5200,13.4050],[52.5201,13.4051],[52.5202,13.4052],[52.5200,13.4050]]}`
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

    // Default coordinates for testing (centered on the provided address)
    const defaultCoordinates = [
      [52.52001, 13.40495],
      [52.52002, 13.40500],
      [52.52003, 13.40498],
      [52.52001, 13.40495]
    ];

    try {
      // Try to parse the response as JSON
      const parsedContent = JSON.parse(content);
      
      // Check if AI reported an error
      if (parsedContent.error) {
        console.log('AI reported error:', parsedContent.error);
        return new Response(
          JSON.stringify({ 
            coordinates: defaultCoordinates,
            aiError: parsedContent.error 
          }), 
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Validate response format
      if (!parsedContent.coordinates || !Array.isArray(parsedContent.coordinates)) {
        console.log('Invalid response format from AI');
        return new Response(
          JSON.stringify({ 
            coordinates: defaultCoordinates,
            aiError: "Invalid response format from AI" 
          }), 
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const coordinates = parsedContent.coordinates;

      // Validate number of points
      if (coordinates.length < 3) {
        console.log('Too few points in AI response');
        return new Response(
          JSON.stringify({ 
            coordinates: defaultCoordinates,
            aiError: "Not enough points to form a polygon" 
          }), 
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Validate coordinate format
      const validCoordinates = coordinates.every((coord: any) => 
        Array.isArray(coord) && 
        coord.length === 2 &&
        typeof coord[0] === 'number' && 
        typeof coord[1] === 'number'
      );

      if (!validCoordinates) {
        console.log('Invalid coordinate format in AI response');
        return new Response(
          JSON.stringify({ 
            coordinates: defaultCoordinates,
            aiError: "Invalid coordinate format in AI response" 
          }), 
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Ensure polygon is closed
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
      
      return new Response(
        JSON.stringify({ 
          coordinates: defaultCoordinates,
          aiError: "Failed to parse AI response" 
        }), 
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
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