import '../types.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.0'
import { Resend } from 'npm:resend@3.2.0'
import { getWelcomeEmailTemplate } from '../send-welcome-email/email-template.ts'

// Get environment variables
const supabaseUrl = Deno.env.get('SUPABASE_URL') || Deno.env.get('VITE_SUPABASE_URL')!
const supabaseServiceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

// Create Supabase client with service role key
const supabase = createClient(supabaseUrl, supabaseServiceRoleKey)

Deno.serve(async (req) => {
  // CORS headers
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  }

  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: corsHeaders })
  }

  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 405 }
    )
  }

  try {
    // Get the most recent verified user who completed the quiz but might not have received welcome email
    const { data: users, error: queryError } = await supabase
      .from('waitlist_users')
      .select('id, email, name, user_type, waitlist_position')
      .eq('is_verified', true)
      .eq('quiz_completed', true)
      .order('updated_at', { ascending: false })
      .limit(1)

    if (queryError) {
      console.error('Database query error:', queryError)
      return new Response(
        JSON.stringify({ error: 'Database query failed' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      )
    }

    if (!users || users.length === 0) {
      return new Response(
        JSON.stringify({ error: 'No users found to send welcome email' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 404 }
      )
    }

    const user = users[0]
    console.log('Sending welcome email to:', user.email)

    // Send welcome email using Resend
    const resendApiKey = Deno.env.get('RESEND_API_KEY')
    if (!resendApiKey) {
      console.error('RESEND_API_KEY not found')
      return new Response(
        JSON.stringify({ error: 'Email service not configured' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      )
    }

    const resend = new Resend(resendApiKey)

    // Prepare email content
    const siteUrl = 'https://purrfectstays.org'
    const emailHtml = getWelcomeEmailTemplate(
      user.name,
      user.waitlist_position || 0,
      user.user_type,
      siteUrl,
      user.email,
      null // Use actual logo
    )

    // Send email with fallback to resend.dev domain
    let emailResult
    try {
      // Try custom domain first
      emailResult = await resend.emails.send({
        to: [user.email],
        subject: `🎉 Welcome to Purrfect Stays! You're #${user.waitlist_position || 0} in Line`,
        html: emailHtml,
        from: 'Purrfect Stays <hello@purrfectstays.org>'
      })
    } catch (customDomainError) {
      console.log('Custom domain failed, trying resend.dev:', customDomainError)
      // Fallback to resend.dev domain
      emailResult = await resend.emails.send({
        to: [user.email],
        subject: `🎉 Welcome to Purrfect Stays! You're #${user.waitlist_position || 0} in Line`,
        html: emailHtml,
        from: 'Purrfect Stays <onboarding@resend.dev>'
      })
    }

    if (emailResult.error) {
      console.error('Email sending failed:', emailResult.error)
      return new Response(
        JSON.stringify({ error: 'Failed to send email', details: emailResult.error }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      )
    }

    console.log('Welcome email sent successfully:', emailResult.data?.id)

    return new Response(
      JSON.stringify({ 
        success: true, 
        messageId: emailResult.data?.id,
        user: user.email,
        position: user.waitlist_position
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    )

  } catch (error) {
    console.error('Function error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})