import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Get all users
    const { data: users, error: usersError } = await supabaseAdmin.auth.admin.listUsers()
    if (usersError) throw usersError

    // Update each user's password
    const updatePromises = users.users.map(user => 
      supabaseAdmin.auth.admin.updateUserById(
        user.id,
        { password: '123456' }
      )
    )

    await Promise.all(updatePromises)

    return new Response(
      JSON.stringify({ message: 'All passwords have been reset to 123456' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})