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
      throw new Error('Bild-URL ist erforderlich');
    }

    console.log('Analysiere Satellitenbild an Position:', location);

    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      console.error('OpenAI API Schlüssel nicht konfiguriert');
      throw new Error('OpenAI API Schlüssel nicht konfiguriert');
    }

    // Verbesserte Bildqualität durch höhere Auflösung
    const enhancedImageUrl = imageUrl
      .replace('size=', 'size=1200x1200') // Größeres Bild
      .replace('zoom=', 'zoom=' + (location?.zoom || 19)) // Maximaler Zoom
      .concat('&scale=2'); // Höhere Auflösung

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
            content: `Du bist ein hochspezialisierter Experte für die Analyse von Satelliten- und Luftbildern, 
            mit besonderem Fokus auf die Erkennung von Dachstrukturen.

            Deine Hauptaufgabe:
            1. Identifiziere das Hauptgebäude im Zentrum des Bildes
            2. Erkenne die exakten Umrisse des Dachs
            3. Markiere die Eckpunkte des Dachs mit präzisen Koordinaten

            Erkennungsmerkmale für Dächer:
            - Suche nach klaren geometrischen Formen (meist rechteckig oder L-förmig)
            - Identifiziere dunkle Linien und Kanten, die Dachränder markieren
            - Beachte Farbkontraste zwischen Dach und Umgebung
            - Nutze Schatten zur Bestätigung von Gebäudekanten
            - Achte auf typische Dachstrukturen wie Schornsteine oder Dachfenster

            Wichtige Regeln:
            1. Konzentriere dich NUR auf das Hauptdach
            2. Ignoriere Nebengebäude und Garagen
            3. Gib die Koordinaten als geschlossenes Polygon zurück
            4. Der erste und letzte Punkt müssen identisch sein
            5. Mindestens 4 Punkte sind erforderlich für ein valides Polygon

            Antwortformat:
            Bei erfolgreicher Erkennung: {"coordinates": [[lat1,lng1], [lat2,lng2], ...]}
            Bei Fehlern: {"error": "Detaillierte Fehlerbeschreibung"}`
          },
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: `Analysiere dieses hochaufgelöste Satellitenbild und identifiziere die präzisen Umrisse des Hauptdachs.
                
                Standort: ${location?.lat}, ${location?.lng}
                Zoom: ${location?.zoom}
                
                Beachte folgende Punkte:
                - Das Hauptgebäude befindet sich im Zentrum des Bildes
                - Markiere nur die Hauptdachfläche
                - Ignoriere Schatten auf dem Boden
                - Gib die Koordinaten als exakte Zahlen zurück
                - Prüfe die Plausibilität der erkannten Form`,
              },
              {
                type: 'image_url',
                image_url: {
                  url: enhancedImageUrl,
                }
              }
            ],
          }
        ],
        max_tokens: 1000,
        temperature: 0.3, // Niedrige Temperatur für präzisere Ergebnisse
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenAI API Fehler:', errorText);
      throw new Error(`OpenAI API Fehler: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log('OpenAI Antwort:', JSON.stringify(data));

    if (!data.choices?.[0]?.message?.content) {
      throw new Error('Unerwartete Antwortstruktur von OpenAI');
    }

    let content = data.choices[0].message.content.trim();
    console.log('Zu parsender Inhalt:', content);

    try {
      const parsedContent = JSON.parse(content);
      
      if (parsedContent.error) {
        console.log('KI meldet Fehler:', parsedContent.error);
        return new Response(
          JSON.stringify({ error: parsedContent.error }), 
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      if (!parsedContent.coordinates || !Array.isArray(parsedContent.coordinates)) {
        throw new Error('Ungültiges Antwortformat von der KI');
      }

      const coordinates = parsedContent.coordinates;

      // Validierung der Koordinaten
      if (coordinates.length < 4) {
        throw new Error('Zu wenige Punkte für ein valides Polygon');
      }

      const validCoordinates = coordinates.every((coord: any) => 
        Array.isArray(coord) && 
        coord.length === 2 &&
        typeof coord[0] === 'number' && 
        typeof coord[1] === 'number' &&
        !isNaN(coord[0]) &&
        !isNaN(coord[1])
      );

      if (!validCoordinates) {
        throw new Error('Ungültiges Koordinatenformat in der KI-Antwort');
      }

      // Sicherstellen, dass das Polygon geschlossen ist
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
      console.error('Fehler beim Parsen der KI-Antwort:', error);
      console.error('Roher Inhalt, der nicht geparst werden konnte:', content);
      throw new Error('Fehler beim Parsen der KI-Antwort');
    }
  } catch (error) {
    console.error('Fehler in der analyze-roof Funktion:', error);
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