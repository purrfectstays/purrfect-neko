#!/usr/bin/env node

/**
 * Simple test for Edge Functions without authentication
 */

import { config } from 'dotenv';

// Load environment variables
config();

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;

async function testSimpleEdgeFunction() {
  console.log('🔍 Testing Edge Functions with simple requests...\n');

  const VERIFICATION_EMAIL_URL = `${SUPABASE_URL}/functions/v1/send-verification-email`;
  
  // Test with a POST request that should trigger CORS and basic validation
  console.log('1️⃣ Testing basic POST request to send-verification-email...');
  
  try {
    const response = await fetch(VERIFICATION_EMAIL_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Origin': 'http://localhost:5173'
      },
      body: JSON.stringify({
        email: 'test@example.com',
        name: 'Test User',
        userType: 'cat-parent',
        verificationToken: 'test-token-123',
        skipEmailSending: true,
        autoVerify: true
      })
    });
    
    console.log(`   Status: ${response.status}`);
    console.log(`   Status Text: ${response.statusText}`);
    console.log(`   Content-Type: ${response.headers.get('content-type')}`);
    console.log(`   CORS Origin: ${response.headers.get('access-control-allow-origin')}`);
    
    // Try to read the response
    const text = await response.text();
    console.log(`   Response Body: ${text}`);
    
    // Try to parse as JSON if possible
    try {
      const json = JSON.parse(text);
      console.log(`   Parsed JSON:`, json);
    } catch (e) {
      console.log(`   Could not parse as JSON: ${e.message}`);
    }
    
  } catch (error) {
    console.error('❌ Request failed:', error.message);
  }
  
  console.log('\n2️⃣ Testing GET request (should return method not allowed)...');
  
  try {
    const response = await fetch(VERIFICATION_EMAIL_URL, {
      method: 'GET',
      headers: {
        'Origin': 'http://localhost:5173'
      }
    });
    
    console.log(`   Status: ${response.status}`);
    console.log(`   Status Text: ${response.statusText}`);
    
    const text = await response.text();
    console.log(`   Response: ${text}`);
    
  } catch (error) {
    console.error('❌ GET request failed:', error.message);
  }
}

testSimpleEdgeFunction().catch(console.error);