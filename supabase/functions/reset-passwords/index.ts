import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Create a Supabase client with the service role key
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )

    // List all users
    const { data: { users }, error: usersError } = await supabaseAdmin.auth.admin.listUsers()
    
    if (usersError) {
      throw usersError
    }

    console.log('Found users:', users.length)

    // Update each user's password
    const updatePromises = users.map(async (user) => {
      console.log('Updating password for user:', user.email)
      const { error } = await supabaseAdmin.auth.admin.updateUserById(
        user.id,
        { password: '123456' }
      )
      if (error) {
        console.error(`Failed to update user ${user.id}:`, error)
        return { userId: user.id, success: false, error: error.message }
      }
      return { userId: user.id, success: true }
    })

    const results = await Promise.all(updatePromises)
    
    return new Response(
      JSON.stringify({
        message: 'Passwords reset successfully',
        results
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )

  } catch (error) {
    console.error('Error in reset-passwords function:', error)
    return new Response(
      JSON.stringify({
        error: error.message
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})