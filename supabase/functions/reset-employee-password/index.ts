import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { email } = await req.json()

    if (!email) {
      throw new Error('Email is required')
    }

    console.log('Resetting password for employee:', email)

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

    // First check if the employee exists
    const { data: employeeData, error: employeeError } = await supabaseAdmin
      .from('employees')
      .select('email')
      .eq('email', email)
      .single()

    if (employeeError || !employeeData) {
      console.error('Employee not found:', email)
      throw new Error('Employee not found')
    }

    // Get user by email
    const { data: { users }, error: getUserError } = await supabaseAdmin.auth.admin.listUsers()
    
    if (getUserError) {
      console.error('Error getting users:', getUserError)
      throw getUserError
    }

    let userId;
    const user = users.find(u => u.email === email)
    
    if (!user) {
      console.log('Auth user not found, creating new user')
      // Create a new auth user if one doesn't exist
      const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
        email: email,
        password: 'Coppen2023!',
        email_confirm: true
      })

      if (createError) {
        console.error('Error creating user:', createError)
        throw createError
      }

      userId = newUser.user.id
      console.log('Created new user:', userId)
    } else {
      userId = user.id
      console.log('Found existing user:', userId)
    }

    // Update password
    const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
      userId,
      { password: 'Coppen2023!' }
    )

    if (updateError) {
      console.error('Error updating password:', updateError)
      throw updateError
    }

    console.log('Password updated successfully')

    return new Response(
      JSON.stringify({ message: 'Password reset successful' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )

  } catch (error) {
    console.error('Error in reset-employee-password function:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})