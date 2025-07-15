#!/usr/bin/env node

/**
 * Test script to verify Edge Functions connectivity and functionality
 */

import { config } from 'dotenv';

// Load environment variables
config();

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const RESEND_API_KEY = process.env.RESEND_API_KEY;

if (!SUPABASE_URL) {
  console.error('❌ Missing VITE_SUPABASE_URL environment variable');
  process.exit(1);
}

// Edge Function URLs
const VERIFICATION_EMAIL_URL = `${SUPABASE_URL}/functions/v1/send-verification-email`;
const WELCOME_EMAIL_URL = `${SUPABASE_URL}/functions/v1/send-welcome-email`;

async function testEdgeFunctionConnectivity() {
  console.log('🔍 Testing Edge Function connectivity...\n');
  console.log('📍 Supabase URL:', SUPABASE_URL);
  console.log('🔑 Service Role Key:', SUPABASE_SERVICE_ROLE_KEY ? '✅ Set' : '❌ Missing');
  console.log('📧 Resend API Key:', RESEND_API_KEY ? '✅ Set' : '❌ Missing');
  console.log();

  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY || 'test'}`,
    'apikey': SUPABASE_SERVICE_ROLE_KEY || 'test'
  };

  // Test 1: Check if send-verification-email function is accessible
  console.log('1️⃣ Testing send-verification-email function accessibility...');
  try {
    const response = await fetch(VERIFICATION_EMAIL_URL, {
      method: 'OPTIONS',
      headers
    });
    
    console.log(`   Status: ${response.status}`);
    console.log(`   CORS Headers: ${response.headers.get('access-control-allow-origin') || 'Not set'}`);
    
    if (response.status === 200) {
      console.log('✅ send-verification-email function is accessible');
    } else {
      console.log('❌ send-verification-email function returned non-200 status');
    }
  } catch (error) {
    console.error('❌ send-verification-email function connectivity error:', error.message);
  }
  console.log();

  // Test 2: Check if send-welcome-email function is accessible
  console.log('2️⃣ Testing send-welcome-email function accessibility...');
  try {
    const response = await fetch(WELCOME_EMAIL_URL, {
      method: 'OPTIONS',
      headers
    });
    
    console.log(`   Status: ${response.status}`);
    console.log(`   CORS Headers: ${response.headers.get('access-control-allow-origin') || 'Not set'}`);
    
    if (response.status === 200) {
      console.log('✅ send-welcome-email function is accessible');
    } else {
      console.log('❌ send-welcome-email function returned non-200 status');
    }
  } catch (error) {
    console.error('❌ send-welcome-email function connectivity error:', error.message);
  }
  console.log();

  // Test 3: Test send-verification-email with invalid data (should return validation error)
  console.log('3️⃣ Testing send-verification-email validation...');
  try {
    const response = await fetch(VERIFICATION_EMAIL_URL, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        email: 'invalid-email',
        name: '',
        userType: 'invalid-type'
      })
    });
    
    const result = await response.json();
    console.log(`   Status: ${response.status}`);
    console.log(`   Response:`, result);
    
    if (response.status === 400 && result.error) {
      console.log('✅ send-verification-email validation working correctly');
    } else {
      console.log('⚠️ send-verification-email validation response unexpected');
    }
  } catch (error) {
    console.error('❌ send-verification-email validation test error:', error.message);
  }
  console.log();

  // Test 4: Test send-welcome-email with invalid data (should return validation error)
  console.log('4️⃣ Testing send-welcome-email validation...');
  try {
    const response = await fetch(WELCOME_EMAIL_URL, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        email: 'invalid-email',
        name: '',
        waitlistPosition: 'not-a-number',
        userType: 'invalid-type'
      })
    });
    
    const result = await response.json();
    console.log(`   Status: ${response.status}`);
    console.log(`   Response:`, result);
    
    if (response.status === 400 && result.error) {
      console.log('✅ send-welcome-email validation working correctly');
    } else {
      console.log('⚠️ send-welcome-email validation response unexpected');
    }
  } catch (error) {
    console.error('❌ send-welcome-email validation test error:', error.message);
  }
  console.log();

  // Test 5: Test send-verification-email with valid data but skipEmailSending (CAPTCHA mode)
  console.log('5️⃣ Testing send-verification-email CAPTCHA mode...');
  try {
    const testEmail = `test-captcha-${Date.now()}@example.com`;
    const response = await fetch(VERIFICATION_EMAIL_URL, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        email: testEmail,
        name: 'Test CAPTCHA User',
        userType: 'cat-parent',
        skipEmailSending: true,
        autoVerify: true
      })
    });
    
    const result = await response.json();
    console.log(`   Status: ${response.status}`);
    console.log(`   Response:`, result);
    
    if (response.status === 200 && result.success) {
      console.log('✅ send-verification-email CAPTCHA mode working');
      
      // Clean up the test user if possible
      console.log('🧹 Attempting to clean up test user...');
      // Note: We would need a cleanup function or direct database access for this
    } else {
      console.log('❌ send-verification-email CAPTCHA mode failed');
    }
  } catch (error) {
    console.error('❌ send-verification-email CAPTCHA test error:', error.message);
  }
  console.log();

  console.log('🏁 Edge Function connectivity tests completed!');
}

// Run the test
testEdgeFunctionConnectivity().catch(error => {
  console.error('❌ Test runner error:', error);
  process.exit(1);
});