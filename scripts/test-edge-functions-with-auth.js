#!/usr/bin/env node

/**
 * Test Edge Functions with proper authentication
 */

import { config } from 'dotenv';

// Load environment variables
config();

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

async function testEdgeFunctionsWithAuth() {
  console.log('🔍 Testing Edge Functions with proper authentication...\n');

  const VERIFICATION_EMAIL_URL = `${SUPABASE_URL}/functions/v1/send-verification-email`;
  const WELCOME_EMAIL_URL = `${SUPABASE_URL}/functions/v1/send-welcome-email`;
  
  console.log('📍 URLs:');
  console.log(`   Verification: ${VERIFICATION_EMAIL_URL}`);
  console.log(`   Welcome: ${WELCOME_EMAIL_URL}`);
  console.log();

  // Test with anon key (typical client request)
  console.log('1️⃣ Testing send-verification-email with anon key...');
  
  try {
    const response = await fetch(VERIFICATION_EMAIL_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${ANON_KEY}`,
        'apikey': ANON_KEY,
        'Origin': 'http://localhost:5173'
      },
      body: JSON.stringify({
        email: 'test@example.com',
        name: 'Test User',
        userType: 'cat-parent',
        verificationToken: 'test-token-123456'
      })
    });
    
    console.log(`   Status: ${response.status}`);
    const result = await response.json();
    console.log(`   Response:`, result);
    
    if (response.status === 200) {
      console.log('✅ Verification email function working with anon key');
    } else if (response.status === 500 || response.status === 503) {
      console.log('⚠️ Function accessible but has internal error (possibly missing RESEND_API_KEY in production)');
    } else {
      console.log('❌ Unexpected response from verification email function');
    }
    
  } catch (error) {
    console.error('❌ Request failed:', error.message);
  }
  
  console.log();

  // Test CAPTCHA mode (skipEmailSending) with anon key
  console.log('2️⃣ Testing send-verification-email CAPTCHA mode with anon key...');
  
  try {
    const testEmail = `test-captcha-${Date.now()}@example.com`;
    const response = await fetch(VERIFICATION_EMAIL_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${ANON_KEY}`,
        'apikey': ANON_KEY,
        'Origin': 'http://localhost:5173'
      },
      body: JSON.stringify({
        email: testEmail,
        name: 'Test CAPTCHA User',
        userType: 'cat-parent',
        skipEmailSending: true,
        autoVerify: true
      })
    });
    
    console.log(`   Status: ${response.status}`);
    const result = await response.json();
    console.log(`   Response:`, result);
    
    if (response.status === 200 && result.success) {
      console.log('✅ CAPTCHA mode working with anon key');
    } else if (response.status === 500 && result.error?.includes('Service configuration')) {
      console.log('⚠️ Function accessible but missing SERVICE_ROLE_KEY in production');
    } else {
      console.log('❌ CAPTCHA mode failed');
    }
    
  } catch (error) {
    console.error('❌ CAPTCHA test failed:', error.message);
  }
  
  console.log();

  // Test welcome email with anon key
  console.log('3️⃣ Testing send-welcome-email with anon key...');
  
  try {
    const response = await fetch(WELCOME_EMAIL_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${ANON_KEY}`,
        'apikey': ANON_KEY,
        'Origin': 'http://localhost:5173'
      },
      body: JSON.stringify({
        email: 'test@example.com',
        name: 'Test User',
        userType: 'cat-parent',
        waitlistPosition: 123
      })
    });
    
    console.log(`   Status: ${response.status}`);
    const result = await response.json();
    console.log(`   Response:`, result);
    
    if (response.status === 200) {
      console.log('✅ Welcome email function working with anon key');
    } else if (response.status === 500 || response.status === 503) {
      console.log('⚠️ Function accessible but has internal error (possibly missing RESEND_API_KEY in production)');
    } else {
      console.log('❌ Unexpected response from welcome email function');
    }
    
  } catch (error) {
    console.error('❌ Welcome email test failed:', error.message);
  }

  console.log();

  // Test with service role key if different from anon key
  if (SERVICE_ROLE_KEY && SERVICE_ROLE_KEY !== ANON_KEY) {
    console.log('4️⃣ Testing with service role key...');
    
    try {
      const testEmail = `test-service-${Date.now()}@example.com`;
      const response = await fetch(VERIFICATION_EMAIL_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
          'apikey': SERVICE_ROLE_KEY,
          'Origin': 'http://localhost:5173'
        },
        body: JSON.stringify({
          email: testEmail,
          name: 'Test Service User',
          userType: 'cat-parent',
          skipEmailSending: true,
          autoVerify: true
        })
      });
      
      console.log(`   Status: ${response.status}`);
      const result = await response.json();
      console.log(`   Response:`, result);
      
      if (response.status === 200) {
        console.log('✅ Service role key working');
      } else {
        console.log('❌ Service role key test failed');
      }
      
    } catch (error) {
      console.error('❌ Service role test failed:', error.message);
    }
  } else {
    console.log('4️⃣ Skipping service role test (same as anon key or not set)');
  }

  console.log('\n🏁 Edge Function authentication tests completed!');
}

testEdgeFunctionsWithAuth().catch(console.error);