/**
 * Test script for send-welcome-email Edge Function
 * This tests the Edge Function directly to identify configuration issues
 */

import { config } from 'dotenv';
config();

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY;

console.log('🧪 Testing send-welcome-email Edge Function...\n');

// Validate environment
if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('❌ Missing required environment variables:');
  console.error('   VITE_SUPABASE_URL:', SUPABASE_URL ? '✅' : '❌');
  console.error('   VITE_SUPABASE_ANON_KEY:', SUPABASE_ANON_KEY ? '✅' : '❌');
  process.exit(1);
}

console.log('✅ Environment variables configured');
console.log('📍 Supabase URL:', SUPABASE_URL);
console.log('🔑 Anon Key:', SUPABASE_ANON_KEY.substring(0, 20) + '...\n');

// Test payload
const testPayload = {
  email: 'test@example.com',
  name: 'Test User',
  waitlistPosition: 123,
  userType: 'cat-parent'
};

console.log('📧 Test payload:', JSON.stringify(testPayload, null, 2), '\n');

// Test 1: Direct HTTP call to Edge Function
async function testDirectCall() {
  console.log('🔄 Test 1: Direct HTTP call to Edge Function...');
  
  const url = `${SUPABASE_URL}/functions/v1/send-welcome-email`;
  console.log('📍 URL:', url);
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testPayload),
    });
    
    console.log('📡 Response status:', response.status, response.statusText);
    console.log('📡 Response headers:');
    response.headers.forEach((value, key) => {
      console.log(`   ${key}: ${value}`);
    });
    
    const responseText = await response.text();
    console.log('📡 Response body:', responseText);
    
    if (response.ok) {
      console.log('✅ Direct call successful!\n');
      return true;
    } else {
      console.error('❌ Direct call failed with status:', response.status);
      
      // Common error explanations
      if (response.status === 404) {
        console.error('\n⚠️  Edge Function not found. Possible causes:');
        console.error('   1. Function not deployed yet');
        console.error('   2. Function name mismatch');
        console.error('   3. Wrong Supabase project URL');
        console.error('\n📌 To deploy: supabase functions deploy send-welcome-email');
      } else if (response.status === 401) {
        console.error('\n⚠️  Authentication error. Possible causes:');
        console.error('   1. Invalid anon key');
        console.error('   2. Function requires service role key');
        console.error('   3. JWT expired or malformed');
      } else if (response.status === 500) {
        console.error('\n⚠️  Internal server error. Check:');
        console.error('   1. RESEND_API_KEY environment variable in Supabase');
        console.error('   2. Function logs in Supabase dashboard');
        console.error('   3. Edge Function code for runtime errors');
      }
      
      console.log('');
      return false;
    }
  } catch (error) {
    console.error('❌ Network error:', error.message);
    console.error('\n⚠️  Could not reach Edge Function. Possible causes:');
    console.error('   1. Invalid Supabase URL');
    console.error('   2. Network connectivity issues');
    console.error('   3. CORS configuration (if running from browser)');
    console.log('');
    return false;
  }
}

// Test 2: Using Supabase client
async function testSupabaseClient() {
  console.log('🔄 Test 2: Using Supabase client...');
  
  try {
    const { createClient } = await import('@supabase/supabase-js');
    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    
    const { data, error } = await supabase.functions.invoke('send-welcome-email', {
      body: testPayload,
    });
    
    if (error) {
      console.error('❌ Supabase client error:', error);
      console.error('   Error details:', JSON.stringify(error, null, 2));
      
      // Check for specific error types
      if (error.message?.includes('Edge Function returned a non-2xx status code')) {
        console.error('\n⚠️  Edge Function error. This usually means:');
        console.error('   1. Missing environment variables (RESEND_API_KEY)');
        console.error('   2. Invalid request payload');
        console.error('   3. Runtime error in the function');
        console.error('\n📌 Check Edge Function logs in Supabase dashboard');
      }
      
      return false;
    }
    
    console.log('✅ Supabase client call successful!');
    console.log('📡 Response data:', JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error('❌ Failed to use Supabase client:', error.message);
    return false;
  }
}

// Test 3: Check Edge Function health
async function testFunctionHealth() {
  console.log('\n🔄 Test 3: Edge Function health check...');
  
  const healthUrl = `${SUPABASE_URL}/functions/v1/send-welcome-email`;
  
  try {
    // Try OPTIONS request first
    const optionsResponse = await fetch(healthUrl, {
      method: 'OPTIONS',
      headers: {
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      },
    });
    
    console.log('📡 OPTIONS response:', optionsResponse.status);
    
    if (optionsResponse.ok || optionsResponse.status === 204) {
      console.log('✅ Edge Function is responding to OPTIONS requests');
      console.log('   CORS headers present:', optionsResponse.headers.has('access-control-allow-origin'));
    }
    
    // Try GET request (should fail with 405 but proves function exists)
    const getResponse = await fetch(healthUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      },
    });
    
    console.log('📡 GET response:', getResponse.status);
    
    if (getResponse.status === 405) {
      console.log('✅ Edge Function exists (correctly rejecting GET requests)');
    } else if (getResponse.status === 404) {
      console.log('❌ Edge Function not found');
    }
    
  } catch (error) {
    console.error('❌ Health check failed:', error.message);
  }
}

// Run all tests
async function runTests() {
  console.log('🚀 Starting Edge Function tests...\n');
  
  const directCallSuccess = await testDirectCall();
  const supabaseClientSuccess = await testSupabaseClient();
  await testFunctionHealth();
  
  console.log('\n📊 Test Summary:');
  console.log('   Direct HTTP call:', directCallSuccess ? '✅' : '❌');
  console.log('   Supabase client:', supabaseClientSuccess ? '✅' : '❌');
  
  if (!directCallSuccess && !supabaseClientSuccess) {
    console.log('\n❌ All tests failed. Action items:');
    console.log('1. Check if Edge Function is deployed:');
    console.log('   supabase functions list');
    console.log('2. Deploy the function if needed:');
    console.log('   supabase functions deploy send-welcome-email');
    console.log('3. Set environment variables in Supabase dashboard:');
    console.log('   - RESEND_API_KEY');
    console.log('   - SITE_URL');
    console.log('   - ALLOWED_ORIGINS');
    console.log('4. Check Edge Function logs in Supabase dashboard');
  }
}

// Run tests
runTests().catch(console.error);