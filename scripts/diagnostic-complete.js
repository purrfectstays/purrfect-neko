#!/usr/bin/env node

/**
 * Comprehensive diagnostic script for Supabase Edge Functions and service role
 */

import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';

// Load environment variables
config();

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const RESEND_API_KEY = process.env.RESEND_API_KEY;

async function runCompleteDiagnostic() {
  console.log('🔍 COMPREHENSIVE SUPABASE DIAGNOSTIC\n');
  console.log('='.repeat(50));
  
  // 1. Environment Variables Check
  console.log('\n1️⃣ ENVIRONMENT VARIABLES:');
  console.log(`   VITE_SUPABASE_URL: ${SUPABASE_URL ? '✅ Set' : '❌ Missing'}`);
  if (SUPABASE_URL) console.log(`      Value: ${SUPABASE_URL}`);
  
  console.log(`   VITE_SUPABASE_ANON_KEY: ${ANON_KEY ? '✅ Set' : '❌ Missing'}`);
  if (ANON_KEY) console.log(`      Length: ${ANON_KEY.length}, Starts with: ${ANON_KEY.substring(0, 20)}...`);
  
  console.log(`   SUPABASE_SERVICE_ROLE_KEY: ${SERVICE_ROLE_KEY ? '✅ Set' : '❌ Missing'}`);
  if (SERVICE_ROLE_KEY) console.log(`      Length: ${SERVICE_ROLE_KEY.length}, Starts with: ${SERVICE_ROLE_KEY.substring(0, 20)}...`);
  
  console.log(`   RESEND_API_KEY: ${RESEND_API_KEY ? '✅ Set' : '❌ Missing'}`);
  if (RESEND_API_KEY) console.log(`      Length: ${RESEND_API_KEY.length}, Starts with: ${RESEND_API_KEY.substring(0, 6)}...`);
  
  // Check if service role key is same as anon key
  if (ANON_KEY && SERVICE_ROLE_KEY) {
    if (ANON_KEY === SERVICE_ROLE_KEY) {
      console.log('   ⚠️  WARNING: ANON_KEY and SERVICE_ROLE_KEY are identical!');
      console.log('       This suggests the service role key is not properly set.');
    } else {
      console.log('   ✅ ANON_KEY and SERVICE_ROLE_KEY are different (correct)');
    }
  }

  if (!SUPABASE_URL || !ANON_KEY) {
    console.log('\n❌ Cannot proceed without basic Supabase configuration');
    return;
  }

  // 2. Supabase Client Test with Anon Key
  console.log('\n2️⃣ SUPABASE CLIENT TEST (ANON KEY):');
  try {
    const supabaseAnon = createClient(SUPABASE_URL, ANON_KEY);
    
    // Test basic connectivity
    const { data, error } = await supabaseAnon
      .from('waitlist_users')
      .select('count')
      .limit(1);
    
    if (error) {
      console.log(`   ❌ Anon client error: ${error.message}`);
    } else {
      console.log('   ✅ Anon client connected successfully');
    }
  } catch (error) {
    console.log(`   ❌ Anon client exception: ${error.message}`);
  }

  // 3. Supabase Client Test with Service Role Key
  if (SERVICE_ROLE_KEY && SERVICE_ROLE_KEY !== ANON_KEY) {
    console.log('\n3️⃣ SUPABASE CLIENT TEST (SERVICE ROLE):');
    try {
      const supabaseService = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);
      
      const { data, error } = await supabaseService
        .from('waitlist_users')
        .select('count')
        .limit(1);
      
      if (error) {
        console.log(`   ❌ Service role client error: ${error.message}`);
      } else {
        console.log('   ✅ Service role client connected successfully');
      }
    } catch (error) {
      console.log(`   ❌ Service role client exception: ${error.message}`);
    }
  } else {
    console.log('\n3️⃣ SKIPPING SERVICE ROLE TEST (same as anon or missing)');
  }

  // 4. Edge Function Discovery
  console.log('\n4️⃣ EDGE FUNCTION DISCOVERY:');
  const edgeFunctions = [
    'send-verification-email',
    'send-welcome-email'
  ];
  
  for (const funcName of edgeFunctions) {
    const funcUrl = `${SUPABASE_URL}/functions/v1/${funcName}`;
    console.log(`\n   Testing ${funcName}:`);
    console.log(`   URL: ${funcUrl}`);
    
    try {
      // Test OPTIONS request (no auth needed for CORS preflight)
      const optionsResponse = await fetch(funcUrl, { method: 'OPTIONS' });
      console.log(`   OPTIONS Status: ${optionsResponse.status}`);
      console.log(`   CORS Headers: ${optionsResponse.headers.get('access-control-allow-origin') || 'Not set'}`);
      
      // Test with anon key
      const authResponse = await fetch(funcUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${ANON_KEY}`,
          'apikey': ANON_KEY
        },
        body: JSON.stringify({ test: true })
      });
      
      console.log(`   POST with anon key: ${authResponse.status}`);
      
      if (authResponse.status !== 404) {
        const responseText = await authResponse.text();
        try {
          const responseJson = JSON.parse(responseText);
          console.log(`   Response: ${JSON.stringify(responseJson).substring(0, 100)}...`);
        } catch {
          console.log(`   Response: ${responseText.substring(0, 100)}...`);
        }
      }
      
    } catch (error) {
      console.log(`   ❌ Error testing ${funcName}: ${error.message}`);
    }
  }

  // 5. JWT Token Analysis
  console.log('\n5️⃣ JWT TOKEN ANALYSIS:');
  
  function analyzeJWT(token, name) {
    try {
      // JWT has 3 parts separated by dots
      const parts = token.split('.');
      if (parts.length !== 3) {
        console.log(`   ${name}: ❌ Not a valid JWT format (${parts.length} parts instead of 3)`);
        return;
      }
      
      // Decode header (first part)
      const header = JSON.parse(atob(parts[0]));
      console.log(`   ${name} Header:`, header);
      
      // Decode payload (second part)
      const payload = JSON.parse(atob(parts[1]));
      console.log(`   ${name} Payload:`, {
        iss: payload.iss,
        exp: payload.exp ? new Date(payload.exp * 1000).toISOString() : 'No expiration',
        iat: payload.iat ? new Date(payload.iat * 1000).toISOString() : 'No issued at',
        role: payload.role,
        aud: payload.aud
      });
      
      // Check if expired
      if (payload.exp && payload.exp * 1000 < Date.now()) {
        console.log(`   ❌ ${name} is EXPIRED`);
      } else {
        console.log(`   ✅ ${name} is not expired`);
      }
      
    } catch (error) {
      console.log(`   ${name}: ❌ Cannot decode JWT: ${error.message}`);
    }
  }
  
  if (ANON_KEY) analyzeJWT(ANON_KEY, 'ANON_KEY');
  if (SERVICE_ROLE_KEY && SERVICE_ROLE_KEY !== ANON_KEY) {
    analyzeJWT(SERVICE_ROLE_KEY, 'SERVICE_ROLE_KEY');
  }

  console.log('\n6️⃣ RECOMMENDATIONS:');
  
  if (ANON_KEY === SERVICE_ROLE_KEY) {
    console.log('   🔧 Get the correct SERVICE_ROLE_KEY from Supabase dashboard');
    console.log('      - Go to Project Settings > API');
    console.log('      - Copy the service_role secret (not the anon public key)');
  }
  
  console.log('   🔧 Verify Edge Functions are deployed:');
  console.log('      - Check Supabase dashboard > Edge Functions');
  console.log('      - Ensure functions are deployed and active');
  
  console.log('   🔧 Check environment variables in production:');
  console.log('      - Ensure RESEND_API_KEY is set in Edge Function environment');
  console.log('      - Ensure SUPABASE_SERVICE_ROLE_KEY is set correctly');
  
  console.log('\n✅ Diagnostic complete!');
}

runCompleteDiagnostic().catch(error => {
  console.error('❌ Diagnostic failed:', error);
  process.exit(1);
});