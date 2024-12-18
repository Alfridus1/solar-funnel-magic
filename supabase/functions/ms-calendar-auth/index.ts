import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const clientId = Deno.env.get('MICROSOFT_CLIENT_ID')
const clientSecret = Deno.env.get('MICROSOFT_CLIENT_SECRET')
const redirectUri = Deno.env.get('MICROSOFT_REDIRECT_URI')
const supabaseUrl = Deno.env.get('SUPABASE_URL')
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (!clientId || !clientSecret || !redirectUri) {
    console.error('Missing Microsoft OAuth credentials');
    return new Response(
      JSON.stringify({ error: 'Microsoft OAuth credentials not configured' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }

  const supabase = createClient(supabaseUrl!, supabaseServiceKey!)
  
  try {
    const { code, employeeId } = await req.json()
    console.log('Received auth code for employee:', employeeId);
    
    // Exchange code for tokens
    const tokenResponse = await fetch('https://login.microsoftonline.com/common/oauth2/v2.0/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        code,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code',
      }),
    })

    const tokens = await tokenResponse.json()
    console.log('Token exchange completed');

    if (!tokens.refresh_token) {
      throw new Error('No refresh token received')
    }

    // Get user's primary calendar
    const calendarResponse = await fetch('https://graph.microsoft.com/v1.0/me/calendar', {
      headers: {
        'Authorization': `Bearer ${tokens.access_token}`,
      },
    })

    const calendar = await calendarResponse.json()
    console.log('Retrieved calendar ID:', calendar.id);

    // Update employee record
    const { error: updateError } = await supabase
      .from('employees')
      .update({
        ms_calendar_connected: true,
        ms_refresh_token: tokens.refresh_token,
        ms_calendar_id: calendar.id
      })
      .eq('id', employeeId)

    if (updateError) {
      console.error('Error updating employee record:', updateError);
      throw updateError;
    }

    return new Response(
      JSON.stringify({ success: true }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Calendar auth error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})