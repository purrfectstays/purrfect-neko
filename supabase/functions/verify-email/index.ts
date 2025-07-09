/// <reference path="../types.ts" />
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

// Helper function to return appropriate response based on request method
function createResponse(req: Request, success: boolean, data: any, corsHeaders: Record<string, string>) {
  const frontendUrl = Deno.env.get('SITE_URL') || 'https://purrfect-landingpage.netlify.app';
  
  if (req.method === 'POST') {
    // Return JSON for POST requests
    return new Response(
      JSON.stringify({
        success,
        ...data
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: success ? 200 : 400,
      }
    );
  } else {
    // Redirect for GET requests
    if (success) {
      const params = new URLSearchParams({
        success: 'true',
        ...data
      });
      return Response.redirect(
        `${frontendUrl}/verify-result?${params.toString()}`,
        302
      );
    } else {
      return Response.redirect(
        `${frontendUrl}/verify-result?success=false&error=${encodeURIComponent(data.error || 'Verification failed')}`,
        302
      );
    }
  }
}

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
      'http://localhost:5174',
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
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Max-Age': '86400',
    'Access-Control-Allow-Credentials': 'false',
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

  // Allow both GET and POST requests for email verification
  if (req.method !== 'GET' && req.method !== 'POST') {
    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 405,
      }
    );
  }

  try {
    let token: string | null = null;
    const frontendUrl = Deno.env.get('SITE_URL') || 'https://purrfect-landingpage.netlify.app';
    
    // Get token from URL parameters for GET requests or body for POST requests
    if (req.method === 'GET') {
      const url = new URL(req.url);
      token = url.searchParams.get('token');
    } else if (req.method === 'POST') {
      try {
        const body = await req.json();
        token = body.token;
      } catch (e) {
        console.error('❌ Failed to parse JSON body:', e);
        return new Response(
          JSON.stringify({ error: 'Invalid JSON body' }),
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 400,
          }
        );
      }
    }

    console.log('🔍 Verification attempt:', {
      token: token ? `${token.substring(0, 8)}...` : 'none',
      frontendUrl,
      origin
    });

    if (!token) {
      console.error('❌ No verification token provided');
      return createResponse(req, false, { error: 'No verification token provided' }, corsHeaders);
    }

    // Validate token format
    const cleanToken = token.trim();
    if (!cleanToken || cleanToken.length < 10) {
      console.error('❌ Invalid token format:', cleanToken);
      return createResponse(req, false, { error: 'Invalid verification token format' }, corsHeaders);
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
      db: {
        schema: 'public',
      },
      global: {
        headers: {
          'Authorization': `Bearer ${supabaseServiceKey}`,
        },
      },
    });

    console.log('🔐 Verifying token:', cleanToken.substring(0, 8) + '...');
    
    // FIXED: Check both verification_tokens table and waitlist_users table
    let existingUser = null;
    let tokenData = null;
    
    // First, try to find token in verification_tokens table
    const { data: tokenResult, error: tokenError } = await supabase
      .from('verification_tokens')
      .select(`
        *,
        waitlist_users (
          id,
          email,
          name,
          user_type,
          is_verified
        )
      `)
      .eq('token', cleanToken)
      .eq('used', false)
      .single();

    if (tokenResult && !tokenError) {
      console.log('✅ Found token in verification_tokens table');
      tokenData = tokenResult;
      existingUser = tokenResult.waitlist_users;
    } else {
      console.log('🔍 Token not found in verification_tokens, checking waitlist_users...');
      
      // Fallback: check waitlist_users table directly
      const { data: userResult, error: userError } = await supabase
        .from('waitlist_users')
        .select('id, email, name, user_type, is_verified')
        .eq('verification_token', cleanToken)
        .single();

      if (userResult && !userError) {
        console.log('✅ Found user with token in waitlist_users table');
        existingUser = userResult;
      }
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

    // Update user to verified status using service role privileges
    console.log('📝 Updating user verification status...');
    console.log('🔑 Using service role key ending in:', supabaseServiceKey.slice(-8));
    
    try {
      // Use service role client to bypass RLS
      const { data: updatedUser, error: updateError } = await supabase
        .from('waitlist_users')
        .update({
          is_verified: true,
          verification_token: null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', existingUser.id)
        .select()
        .single();

      if (updateError) {
        console.error('❌ Failed to update user:', {
          error: updateError,
          userId: existingUser.id,
          email: existingUser.email,
          code: updateError.code,
          message: updateError.message,
          details: updateError.details,
          hint: updateError.hint
        });
        
        // Try alternative approach - mark as verified without clearing token first
        console.log('🔄 Trying alternative update approach...');
        const { data: altUpdatedUser, error: altUpdateError } = await supabase
          .from('waitlist_users')
          .update({ is_verified: true })
          .eq('id', existingUser.id)
          .eq('verification_token', cleanToken)
          .select()
          .single();
          
        if (altUpdateError) {
          console.error('❌ Alternative update also failed:', altUpdateError);
          return Response.redirect(
            `${frontendUrl}/verify-result?success=false&error=${encodeURIComponent('Failed to verify email due to database restrictions. Please contact support.')}`,
            302
          );
        }
        
        console.log('✅ Alternative update succeeded');
        
        // Now clear the token in a separate update
        await supabase
          .from('waitlist_users')
          .update({ verification_token: null })
          .eq('id', existingUser.id);
          
        updatedUser = altUpdatedUser;
      }
      
      // If we found the token in verification_tokens table, mark it as used
      if (tokenData) {
        console.log('📝 Marking verification token as used...');
        await supabase
          .from('verification_tokens')
          .update({ used: true })
          .eq('token', cleanToken);
      }
      
      // Return success response
      return createResponse(req, true, {
        user_id: updatedUser.id,
        user_type: updatedUser.user_type,
        name: updatedUser.name,
        email: updatedUser.email,
        message: 'Email verified successfully',
      }, corsHeaders);
      
    } catch (updateError) {
      console.error('❌ Update operation failed:', updateError);
      return Response.redirect(
        `${frontendUrl}/verify-result?success=false&error=${encodeURIComponent('Failed to verify email. Please try again.')}`,
        302
      );
    }

  } catch (error) {
    console.error('❌ Verification error:', error);
    
    const frontendUrl = Deno.env.get('SITE_URL') || 'https://purrfect-landingpage.netlify.app';
    return Response.redirect(
      `${frontendUrl}/verify-result?success=false&error=${encodeURIComponent('An unexpected error occurred')}`,
      302
    );
  }
});