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

    // Parse and validate the URL
    const url = new URL(imageUrl);
    const sizeParam = url.searchParams.get('size');
    if (!sizeParam) {
      throw new Error('Size parameter is missing from the image URL');
    }

    // Validate size format
    const [width, height] = sizeParam.split('x').map(Number);
    if (isNaN(width) || isNaN(height)) {
      throw new Error('Invalid size format in image URL');
    }

    // Construct a clean URL with proper parameters
    const enhancedImageUrl = `https://maps.googleapis.com/maps/api/staticmap`
      + `?center=${location?.lat},${location?.lng}`
      + `&zoom=${location?.zoom || 19}`
      + `&size=${width}x${height}`
      + `&scale=2`
      + `&maptype=satellite`
      + `&style=feature:all|element:labels|visibility:off`
      + `&key=${url.searchParams.get('key')}`;

    console.log('Enhanced image URL:', enhancedImageUrl);

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
            content: `You are a highly specialized AI trained to analyze satellite imagery and identify roof outlines. 
            Your task is to return ONLY the coordinates of roof corners in the following JSON format:
            {"coordinates": [[lat1,lng1], [lat2,lng2], ...]}
            
            If you cannot identify the roof clearly, return:
            {"error": "Could not identify roof outline clearly"}
            
            DO NOT return any explanatory text or instructions.`
          },
          {
            role: 'user',
            content: [
              {
                type: "text",
                text: `Analyze this satellite image and return ONLY the roof corner coordinates in the specified JSON format.
                Location: ${location?.lat}, ${location?.lng}
                Zoom: ${location?.zoom}`
              },
              {
                type: "image_url",
                image_url: {
                  url: enhancedImageUrl
                }
              }
            ]
          }
        ],
        max_tokens: 1000,
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenAI API Error:', errorText);
      throw new Error(`OpenAI API Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log('OpenAI Response:', JSON.stringify(data));

    if (!data.choices?.[0]?.message?.content) {
      throw new Error('Unexpected response structure from OpenAI');
    }

    let content = data.choices[0].message.content.trim();
    console.log('Content to parse:', content);

    try {
      // Try to parse the response as JSON
      const parsedContent = JSON.parse(content);
      
      if (parsedContent.error) {
        console.log('AI reports error:', parsedContent.error);
        return new Response(
          JSON.stringify({ error: parsedContent.error }), 
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      if (!parsedContent.coordinates || !Array.isArray(parsedContent.coordinates)) {
        throw new Error('Invalid response format from AI');
      }

      // Validate coordinates
      if (parsedContent.coordinates.length < 4) {
        throw new Error('Too few points for a valid polygon');
      }

      const validCoordinates = parsedContent.coordinates.every((coord: any) => 
        Array.isArray(coord) && 
        coord.length === 2 &&
        typeof coord[0] === 'number' && 
        typeof coord[1] === 'number' &&
        !isNaN(coord[0]) &&
        !isNaN(coord[1])
      );

      if (!validCoordinates) {
        throw new Error('Invalid coordinate format in AI response');
      }

      // Ensure polygon is closed
      const coordinates = parsedContent.coordinates;
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
      console.error('Error parsing AI response:', error);
      console.error('Raw content that could not be parsed:', content);
      return new Response(
        JSON.stringify({ 
          error: "Could not identify roof outline. Please try drawing it manually.",
          details: error.message 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
  } catch (error) {
    console.error('Error in analyze-roof function:', error);
    return new Response(
      JSON.stringify({ 
        error: "Could not analyze roof. Please try drawing it manually.",
        details: error.message 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});