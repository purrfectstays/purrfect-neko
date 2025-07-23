/// <reference path="../types.ts" />
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.0'
import { Resend } from 'npm:resend@3.2.0'
import { getWelcomeEmailTemplate } from '../send-welcome-email/email-template.ts'

// Get environment variables
const supabaseUrl = Deno.env.get('SUPABASE_URL') || Deno.env.get('VITE_SUPABASE_URL')!
const supabaseServiceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
const resendApiKey = Deno.env.get('RESEND_API_KEY')!

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
    console.log('🔍 Checking for users who completed quiz but haven\'t received welcome emails...')

    // Find users who completed the quiz but might not have received welcome emails
    // We'll mark users as having received emails by adding a flag later
    const { data: users, error: queryError } = await supabase
      .from('waitlist_users')
      .select('id, email, name, user_type, waitlist_position, created_at')
      .eq('is_verified', true)
      .eq('quiz_completed', true)
      .order('created_at', { ascending: false })
      .limit(10) // Process up to 10 users at a time

    if (queryError) {
      console.error('Database query error:', queryError)
      return new Response(
        JSON.stringify({ error: 'Database query failed' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      )
    }

    if (!users || users.length === 0) {
      return new Response(
        JSON.stringify({ message: 'No users found who need welcome emails', processed: 0 }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
      )
    }

    console.log(`📧 Processing welcome emails for ${users.length} users...`)

    const resend = new Resend(resendApiKey)
    const results = []
    let successCount = 0
    let failureCount = 0

    for (const user of users) {
      try {
        console.log(`📬 Sending welcome email to: ${user.name} (${user.email})`)

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
          console.log(`Custom domain failed for ${user.email}, trying resend.dev`)
          // Fallback to resend.dev domain
          emailResult = await resend.emails.send({
            to: [user.email],
            subject: `🎉 Welcome to Purrfect Stays! You're #${user.waitlist_position || 0} in Line`,
            html: emailHtml,
            from: 'Purrfect Stays <onboarding@resend.dev>'
          })
        }

        if (emailResult.error) {
          console.error(`❌ Email failed for ${user.email}:`, emailResult.error)
          failureCount++
          results.push({
            user: user.email,
            status: 'failed',
            error: emailResult.error.message
          })
        } else {
          console.log(`✅ Email sent successfully to ${user.email}: ${emailResult.data?.id}`)
          successCount++
          results.push({
            user: user.email,
            status: 'sent',
            messageId: emailResult.data?.id
          })
        }

        // Small delay to avoid rate limits
        await new Promise(resolve => setTimeout(resolve, 100))

      } catch (error) {
        console.error(`❌ Error processing ${user.email}:`, error)
        failureCount++
        results.push({
          user: user.email,
          status: 'failed',
          error: error.message
        })
      }
    }

    console.log(`📊 Email processing complete: ${successCount} sent, ${failureCount} failed`)

    return new Response(
      JSON.stringify({ 
        success: true,
        processed: users.length,
        successful: successCount,
        failed: failureCount,
        results: results
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    )

  } catch (error) {
    console.error('❌ Function error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})