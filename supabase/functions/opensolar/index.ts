import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const OPENSOLAR_API_BASE = "https://api.opensolar.com/api"
const OPENSOLAR_ORG_ID = "41888"
const OPENSOLAR_API_KEY = "s_AJF4RXDL7ZAOOW5OMEFGPDJDBIBIF34A"

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const url = new URL(req.url)
    const endpoint = url.searchParams.get('endpoint')
    
    if (!endpoint) {
      throw new Error('Endpoint parameter is required')
    }

    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    )

    // Make request to OpenSolar API
    const response = await fetch(`${OPENSOLAR_API_BASE}/orgs/${OPENSOLAR_ORG_ID}/${endpoint}`, {
      headers: {
        'Authorization': `Bearer ${OPENSOLAR_API_KEY}`,
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`OpenSolar API error: ${response.statusText}`)
    }

    const data = await response.json()

    // Store the response in Supabase if it's a project
    if (endpoint.includes('projects') && data) {
      try {
        const { error } = await supabaseClient
          .from('opensolar_projects')
          .upsert(
            Array.isArray(data) ? data.map((project: any) => ({
              opensolar_id: project.id,
              title: project.name,
              address: project.address,
              stage: project.stage,
              created_date: project.created_at,
              modified_date: project.updated_at,
              annual_usage: project.annual_usage || 0,
              lat: project.latitude,
              lon: project.longitude,
              system_details: project.system_details
            })) : []
          )

        if (error) {
          console.error('Error storing projects:', error)
        }
      } catch (error) {
        console.error('Error processing projects:', error)
      }
    }

    return new Response(
      JSON.stringify(data),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        } 
      }
    )

  } catch (error) {
    console.error('Error:', error.message)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 400,
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    )
  }
})