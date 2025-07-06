/// <reference path="../types.ts" />
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

// Environment-driven CORS configuration
function getCorsHeaders(origin: string | null): Record<string, string> {
  const envOrigins = Deno.env.get('ALLOWED_ORIGINS');
  const siteUrl = Deno.env.get('SITE_URL') || 'https://purrfect-landingpage.netlify.app';
  
  let allowedOrigins: string[];
  
  if (envOrigins) {
    allowedOrigins = envOrigins.split(',').map(url => url.trim());
  } else {
    allowedOrigins = [
      siteUrl,
      'https://purrfect-landingpage.netlify.app',
      'https://purrfectstays.org',
      'https://www.purrfectstays.org',
      'http://localhost:5173',
      'http://localhost:3000'
    ];
  }
  
  const isDevelopment = origin && origin.includes('localhost');
  const allowedOrigin = isDevelopment && allowedOrigins.includes(origin) 
    ? origin 
    : origin && allowedOrigins.includes(origin) 
      ? origin 
      : siteUrl;
  
  return {
    'Access-Control-Allow-Origin': allowedOrigin,
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Max-Age': '86400',
    'Vary': 'Origin',
  };
}

Deno.serve(async (req) => {
  const origin = req.headers.get('origin');
  const corsHeaders = getCorsHeaders(origin);
  
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { 
      status: 200,
      headers: corsHeaders 
    });
  }

  // Only allow GET requests for email verification
  if (req.method !== 'GET') {
    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 405,
      }
    );
  }

  try {
    // Get token from URL parameters
    const url = new URL(req.url);
    const token = url.searchParams.get('token');
    const frontendUrl = url.searchParams.get('redirect_url') || Deno.env.get('SITE_URL') || 'https://purrfect-landingpage.netlify.app';

    console.log('🔍 Verification attempt:', {
      token: token ? `${token.substring(0, 8)}...` : 'none',
      frontendUrl,
      origin
    });

    if (!token) {
      console.error('❌ No verification token provided');
      return Response.redirect(
        `${frontendUrl}/verify-result?success=false&error=${encodeURIComponent('No verification token provided')}`,
        302
      );
    }

    // Validate token format
    const cleanToken = token.trim();
    if (!cleanToken || cleanToken.length < 10) {
      console.error('❌ Invalid token format:', cleanToken);
      return Response.redirect(
        `${frontendUrl}/verify-result?success=false&error=${encodeURIComponent('Invalid verification token format')}`,
        302
      );
    }

    // Create Supabase client with service role
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    if (!supabaseServiceKey) {
      console.error('❌ Service role key not configured');
      return Response.redirect(
        `${frontendUrl}/verify-result?success=false&error=${encodeURIComponent('Server configuration error')}`,
        302
      );
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });

    console.log('🔐 Verifying token:', cleanToken.substring(0, 8) + '...');
    
    // FIXED: First check if user exists with this token (regardless of verification status)
    const { data: existingUser, error: checkError } = await supabase
      .from('waitlist_users')
      .select('id, email, name, user_type, is_verified')
      .eq('verification_token', cleanToken)
      .single();

    if (checkError && checkError.code !== 'PGRST116') { // PGRST116 = no rows found
      console.error('❌ Database error:', checkError);
      return Response.redirect(
        `${frontendUrl}/verify-result?success=false&error=${encodeURIComponent('Database error occurred')}`,
        302
      );
    }

    // If no user found with this token
    if (!existingUser) {
      console.error('❌ No user found with token');
      
      // Log some debug info (remove in production)
      const { data: recentUsers } = await supabase
        .from('waitlist_users')
        .select('id, email, created_at, is_verified')
        .order('created_at', { ascending: false })
        .limit(5);
      
      console.log('📊 Recent users:', recentUsers?.map(u => ({
        email: u.email.substring(0, 3) + '***',
        created: u.created_at,
        verified: u.is_verified
      })));
      
      return Response.redirect(
        `${frontendUrl}/verify-result?success=false&error=${encodeURIComponent('Invalid or expired verification token')}`,
        302
      );
    }

    // Check if already verified
    if (existingUser.is_verified) {
      console.log('✅ User already verified:', existingUser.email);
      
      // Still redirect with success - they're verified!
      const params = new URLSearchParams({
        success: 'true',
        user_id: existingUser.id,
        user_type: existingUser.user_type,
        name: existingUser.name,
        email: existingUser.email,
        message: 'Email already verified',
      });

      return Response.redirect(
        `${frontendUrl}/verify-result?${params.toString()}`,
        302
      );
    }

    // Update user to verified status
    console.log('📝 Updating user verification status...');
    const { data: updatedUser, error: updateError } = await supabase
      .from('waitlist_users')
      .update({
        is_verified: true,
        verification_token: null, // Clear the token after use
        updated_at: new Date().toISOString(),
      })
      .eq('id', existingUser.id)
      .select()
      .single();

    if (updateError) {
      console.error('❌ Failed to update user:', updateError);
      return Response.redirect(
        `${frontendUrl}/verify-result?success=false&error=${encodeURIComponent('Failed to verify email. Please try again.')}`,
        302
      );
    }

    console.log('✅ Email verification successful for:', updatedUser.email);
    
    // Redirect to frontend with success and user data
    const params = new URLSearchParams({
      success: 'true',
      user_id: updatedUser.id,
      user_type: updatedUser.user_type,
      name: updatedUser.name,
      email: updatedUser.email,
    });

    return Response.redirect(
      `${frontendUrl}/verify-result?${params.toString()}`,
      302
    );

  } catch (error) {
    console.error('❌ Verification error:', error);
    
    const frontendUrl = Deno.env.get('SITE_URL') || 'https://purrfect-landingpage.netlify.app';
    return Response.redirect(
      `${frontendUrl}/verify-result?success=false&error=${encodeURIComponent('An unexpected error occurred')}`,
      302
    );
  }
});