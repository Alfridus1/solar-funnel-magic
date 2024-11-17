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
            content: `Du bist ein Experte für die Analyse von Satelliten- und Luftbildern von Dächern. 
            Deine Aufgabe ist es, die genauen Koordinaten der Eckpunkte des Hauptdachs zu identifizieren.

            Wichtige Merkmale für die Dacherkennung:
            1. Suche nach rechteckigen oder geometrischen Formen
            2. Achte auf Schatten und Kontraste, die Dachkanten markieren
            3. Konzentriere dich auf das größte zusammenhängende Dach im Zentrum
            4. Beachte Farbunterschiede zwischen Dach und Umgebung
            5. Ignoriere kleinere Anbauten oder Nebengebäude

            Gib die Koordinaten als geschlossenes Polygon zurück (erster und letzter Punkt müssen identisch sein).
            Format: [[lat1,lng1], [lat2,lng2], [lat3,lng3], [lat1,lng1]]

            Bei erfolgreicher Erkennung: {"coordinates": [[lat1,lng1], [lat2,lng2], ...]}
            Bei Fehlern: {"error": "Spezifische Fehlermeldung"}`
          },
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: `Bitte analysiere dieses Satellitenbild und identifiziere die Umrisse des Hauptdachs. 
                Standort: ${location?.lat}, ${location?.lng}
                Zoom: ${location?.zoom}
                
                Wichtig:
                - Konzentriere dich auf das zentrale Gebäude
                - Markiere nur das Hauptdach
                - Ignoriere Schatten auf dem Boden
                - Gib die Koordinaten als präzise Zahlen zurück`,
              },
              {
                type: 'image_url',
                image_url: {
                  url: imageUrl,
                }
              }
            ],
          }
        ],
        max_tokens: 1000,
        temperature: 0.3, // Reduzierte Temperatur für präzisere Antworten
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
        details: 'Fehler bei der Dachanalyse. Bitte versuchen Sie es erneut.' 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});