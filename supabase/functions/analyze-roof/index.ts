import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

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
    console.log('Analyzing image at location:', location);
    
    if (!imageUrl) {
      throw new Error('Image URL is required');
    }

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
            content: `You are a highly specialized AI trained to analyze satellite imagery and identify roof outlines with high precision. 
            Your task is to identify the roof marked with a red marker and return its corner coordinates.
            
            Important guidelines for accurate roof detection:
            1. Focus exclusively on the building with the red marker
            2. Analyze the image carefully to identify clear roof edges and corners
            3. Return coordinates in clockwise order starting from the top-left corner
            4. Pay special attention to:
               - Shadow patterns to determine roof edges
               - Color and texture changes that indicate roof boundaries
               - Architectural features like chimneys or solar panels
            5. If multiple buildings are present, only outline the one with the marker
            6. If you cannot identify the roof clearly, return {"error": "Could not identify roof outline clearly"}
            
            Return the coordinates in this exact format:
            {"coordinates": [[lat1,lng1], [lat2,lng2], ...]}
            
            Return ONLY the JSON response, no explanations.`
          },
          {
            role: 'user',
            content: [
              {
                type: "text",
                text: `Analyze this satellite image and provide precise roof corner coordinates for the building marked with the red marker.
                Location: ${location?.lat}, ${location?.lng}
                Zoom: ${location?.zoom}`
              },
              {
                type: "image_url",
                image_url: {
                  url: imageUrl,
                  detail: "high"
                }
              }
            ]
          }
        ],
        max_tokens: 1000,
        temperature: 0.1,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenAI API Error:', errorText);
      throw new Error(`OpenAI API Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log('OpenAI Response:', JSON.stringify(data));

    const content = data.choices[0].message.content.trim();
    console.log('Parsed content:', content);

    try {
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

      return new Response(
        JSON.stringify({ coordinates: parsedContent.coordinates }), 
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );

    } catch (error) {
      console.error('Error parsing AI response:', error);
      return new Response(
        JSON.stringify({ 
          error: "Konnte Dachform nicht erkennen. Bitte zeichnen Sie den Umriss manuell ein.",
          details: error.message 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
  } catch (error) {
    console.error('Error in analyze-roof function:', error);
    return new Response(
      JSON.stringify({ 
        error: "Fehler bei der Analyse. Bitte zeichnen Sie den Umriss manuell ein.",
        details: error.message 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});