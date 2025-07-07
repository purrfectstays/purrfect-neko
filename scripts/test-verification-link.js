/**
 * Test the actual verification link behavior
 * This simulates what happens when a user clicks the email link
 */

const SUPABASE_URL = 'https://ollsdbhjhquivjkjnei.supabase.co';
const TEST_TOKEN = 'test-token-12345';

async function testVerificationLink() {
  console.log('🔍 Testing email verification link...\n');

  const verificationUrl = `${SUPABASE_URL}/functions/v1/verify-email?token=${TEST_TOKEN}&redirect_url=https://purrfect-landingpage.netlify.app`;
  
  console.log('📧 Verification URL:', verificationUrl);
  console.log('This is what users receive in their email.\n');

  // Test 1: Direct GET request (simulating link click)
  console.log('Test 1: Simulating link click (GET request)');
  try {
    const response = await fetch(verificationUrl, {
      method: 'GET',
      redirect: 'manual', // Don't follow redirects automatically
    });

    console.log(`Status: ${response.status}`);
    console.log('Headers:');
    console.log(`- Content-Type: ${response.headers.get('content-type')}`);
    console.log(`- Location: ${response.headers.get('location')}`);
    console.log(`- Access-Control-Allow-Origin: ${response.headers.get('access-control-allow-origin')}`);
    
    if (response.status === 302) {
      console.log('✅ Redirect response received (expected behavior)');
      const location = response.headers.get('location');
      if (location) {
        const redirectUrl = new URL(location);
        console.log('\nRedirect details:');
        console.log(`- Success: ${redirectUrl.searchParams.get('success')}`);
        console.log(`- Error: ${redirectUrl.searchParams.get('error')}`);
      }
    } else if (response.status === 401) {
      console.log('❌ 401 Unauthorized - Edge Function requires authentication');
      const body = await response.text();
      console.log('Response:', body);
    } else {
      console.log(`⚠️  Unexpected status: ${response.status}`);
      const body = await response.text();
      console.log('Response:', body);
    }
  } catch (error) {
    console.log('❌ Request error:', error.message);
  }

  console.log('\n');

  // Test 2: Check if Edge Function is accessible
  console.log('Test 2: Check Edge Function accessibility');
  try {
    const response = await fetch(`${SUPABASE_URL}/functions/v1/verify-email`, {
      method: 'OPTIONS',
    });

    console.log(`OPTIONS Status: ${response.status}`);
    if (response.status === 200) {
      console.log('✅ Edge Function is accessible');
    } else if (response.status === 401) {
      console.log('❌ Edge Function requires authentication even for OPTIONS');
    }
  } catch (error) {
    console.log('❌ OPTIONS request error:', error.message);
  }

  console.log('\n📝 Analysis:');
  console.log('If you see 401 errors, the Edge Function might be:');
  console.log('1. Not properly deployed');
  console.log('2. Missing proper configuration');
  console.log('3. Protected by Supabase auth settings');
  console.log('\nThe Edge Function should be publicly accessible for email verification to work.');
}

testVerificationLink();