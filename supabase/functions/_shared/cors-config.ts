/**
 * Shared CORS configuration for all Edge Functions
 * This centralizes CORS management and uses environment variables
 */

// Environment-driven CORS configuration
export function getCorsHeaders(origin: string | null): Record<string, string> {
  // Get allowed origins from environment variables
  const envOrigins = Deno.env.get('ALLOWED_ORIGINS');
  const siteUrl = Deno.env.get('SITE_URL') || 'https://purrfect-landingpage.netlify.app';
  
  let allowedOrigins: string[];
  
  if (envOrigins) {
    // Parse comma-separated origins from environment
    allowedOrigins = envOrigins.split(',').map(url => url.trim());
  } else {
    // Fallback to default origins
    allowedOrigins = [
      siteUrl,
      'https://purrfect-landingpage.netlify.app',
      'https://purrfectstays.org',
      'https://www.purrfectstays.org',
      'http://localhost:5173',
      'http://localhost:3000'
    ];
  }
  
  // For development, be more permissive with localhost
  const isDevelopment = origin && origin.includes('localhost');
  const allowedOrigin = isDevelopment && allowedOrigins.includes(origin) 
    ? origin 
    : origin && allowedOrigins.includes(origin) 
      ? origin 
      : allowedOrigins[0]; // Use first allowed origin as default
  
  return {
    'Access-Control-Allow-Origin': allowedOrigin,
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, origin, accept, x-requested-with, cache-control, pragma, access-control-allow-origin, access-control-allow-headers',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Max-Age': '86400',
    'Access-Control-Allow-Credentials': 'true',
    'Vary': 'Origin',
  };
}

// Get site URL with proper protocol handling
export function getSiteUrl(requestOrigin?: string | null): string {
  let siteUrl = Deno.env.get('SITE_URL') || 'https://purrfect-landingpage.netlify.app';
  
  // Allow localhost for development
  if (requestOrigin && requestOrigin.includes('localhost')) {
    return requestOrigin;
  }
  
  // Ensure the URL has a protocol for production
  if (!siteUrl.startsWith('http://') && !siteUrl.startsWith('https://')) {
    siteUrl = `https://${siteUrl}`;
  }
  
  return siteUrl;
}

// Create standardized error response
export function createErrorResponse(
  error: string, 
  status: number = 500, 
  corsHeaders: Record<string, string> = {},
  details?: any
): Response {
  const body: any = { error };
  if (details) {
    body.details = details;
  }
  
  return new Response(
    JSON.stringify(body),
    {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status,
    }
  );
}

// Create standardized success response
export function createSuccessResponse(
  data: any,
  corsHeaders: Record<string, string> = {}
): Response {
  return new Response(
    JSON.stringify(data),
    {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    }
  );
}

// Validate environment configuration
export function validateEnvironment(): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  const resendApiKey = Deno.env.get('RESEND_API_KEY');
  if (!resendApiKey) {
    errors.push('RESEND_API_KEY is missing');
  } else if (!resendApiKey.startsWith('re_')) {
    errors.push('RESEND_API_KEY format is invalid');
  }
  
  const supabaseUrl = Deno.env.get('SUPABASE_URL');
  if (!supabaseUrl) {
    errors.push('SUPABASE_URL is missing');
  }
  
  const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  if (!serviceRoleKey) {
    errors.push('SUPABASE_SERVICE_ROLE_KEY is missing');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

// Log environment status (safe for production)
export function logEnvironmentStatus(): void {
  const validation = validateEnvironment();
  
  console.log('🔧 Environment Configuration:');
  console.log('- RESEND_API_KEY:', Deno.env.get('RESEND_API_KEY') ? '✅ Set' : '❌ Missing');
  console.log('- SUPABASE_URL:', Deno.env.get('SUPABASE_URL') ? '✅ Set' : '❌ Missing');
  console.log('- SUPABASE_SERVICE_ROLE_KEY:', Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ? '✅ Set' : '❌ Missing');
  console.log('- SITE_URL:', Deno.env.get('SITE_URL') || 'Using default');
  console.log('- ALLOWED_ORIGINS:', Deno.env.get('ALLOWED_ORIGINS') || 'Using defaults');
  
  if (!validation.isValid) {
    console.error('❌ Environment validation failed:', validation.errors);
  } else {
    console.log('✅ Environment validation passed');
  }
}