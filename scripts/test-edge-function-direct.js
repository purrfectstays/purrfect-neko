/**
 * Direct test of Edge Function CORS
 * Tests the actual deployed functions
 */

const SUPABASE_URL = 'https://ollsdbhjhquivjkjnei.supabase.co';

async function testEdgeFunctionCORS() {
  console.log('🔍 Testing Edge Function CORS directly...\n');

  // Test 1: OPTIONS request to send-verification-email
  console.log('Test 1: OPTIONS request to send-verification-email');
  try {
    const response = await fetch(`${SUPABASE_URL}/functions/v1/send-verification-email`, {
      method: 'OPTIONS',
      headers: {
        'Origin': 'https://purrfect-landingpage.netlify.app',
        'Access-Control-Request-Method': 'POST',
        'Access-Control-Request-Headers': 'content-type',
      },
    });

    console.log(`Status: ${response.status}`);
    console.log('CORS Headers:');
    console.log(`- Access-Control-Allow-Origin: ${response.headers.get('access-control-allow-origin')}`);
    console.log(`- Access-Control-Allow-Methods: ${response.headers.get('access-control-allow-methods')}`);
    console.log(`- Access-Control-Allow-Headers: ${response.headers.get('access-control-allow-headers')}`);
    
    if (response.status === 200) {
      console.log('✅ OPTIONS request successful');
    } else {
      console.log('❌ OPTIONS request failed');
    }
  } catch (error) {
    console.log('❌ OPTIONS request error:', error.message);
  }

  console.log('\n');

  // Test 2: POST request to send-verification-email (should fail but with proper CORS)
  console.log('Test 2: POST request to send-verification-email');
  try {
    const response = await fetch(`${SUPABASE_URL}/functions/v1/send-verification-email`, {
      method: 'POST',
      headers: {
        'Origin': 'https://purrfect-landingpage.netlify.app',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'test@example.com',
        name: 'Test User',
        verificationToken: 'test-token',
        userType: 'cat-parent',
      }),
    });

    console.log(`Status: ${response.status}`);
    console.log(`CORS Origin: ${response.headers.get('access-control-allow-origin')}`);
    
    if (response.headers.get('access-control-allow-origin')) {
      console.log('✅ CORS headers present');
    } else {
      console.log('❌ CORS headers missing');
    }
    
    const text = await response.text();
    console.log('Response:', text.substring(0, 100) + '...');
  } catch (error) {
    console.log('❌ POST request error:', error.message);
  }

  console.log('\n');

  // Test 3: GET request to verify-email
  console.log('Test 3: GET request to verify-email');
  try {
    const response = await fetch(`${SUPABASE_URL}/functions/v1/verify-email?token=test`, {
      method: 'GET',
      headers: {
        'Origin': 'https://purrfect-landingpage.netlify.app',
      },
    });

    console.log(`Status: ${response.status}`);
    console.log(`CORS Origin: ${response.headers.get('access-control-allow-origin')}`);
    
    if (response.status === 302) {
      console.log('✅ Redirect response (expected for test token)');
      console.log(`Location: ${response.headers.get('location')}`);
    }
  } catch (error) {
    console.log('❌ GET request error:', error.message);
  }

  console.log('\n📝 Summary:');
  console.log('After deploying the CORS fixes, all Edge Functions should:');
  console.log('1. Respond to OPTIONS requests with proper CORS headers');
  console.log('2. Include Access-Control-Allow-Origin: * in all responses');
  console.log('3. Allow POST requests from your domain');
}

testEdgeFunctionCORS();