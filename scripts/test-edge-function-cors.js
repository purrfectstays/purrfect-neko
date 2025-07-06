/**
 * Test script to diagnose Edge Function CORS issues
 * Run this with: node scripts/test-edge-function-cors.js
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: join(__dirname, '..', '.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing Supabase configuration. Please check your .env file.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testEdgeFunctionCORS() {
  console.log('🔍 Testing Edge Function CORS configuration...\n');
  
  console.log('📋 Configuration:');
  console.log(`Supabase URL: ${supabaseUrl}`);
  console.log(`Site URL: ${process.env.VITE_APP_URL || 'Not set'}`);
  console.log('\n');

  try {
    // Test 1: Direct fetch to Edge Function
    console.log('Test 1: Direct fetch to Edge Function');
    const directResponse = await fetch(`${supabaseUrl}/functions/v1/send-verification-email`, {
      method: 'OPTIONS',
      headers: {
        'Origin': process.env.VITE_APP_URL || 'http://localhost:5173',
        'Access-Control-Request-Method': 'POST',
        'Access-Control-Request-Headers': 'authorization, x-client-info, apikey, content-type',
      },
    });

    console.log(`OPTIONS response status: ${directResponse.status}`);
    console.log('CORS Headers:');
    console.log(`- Access-Control-Allow-Origin: ${directResponse.headers.get('access-control-allow-origin')}`);
    console.log(`- Access-Control-Allow-Methods: ${directResponse.headers.get('access-control-allow-methods')}`);
    console.log(`- Access-Control-Allow-Headers: ${directResponse.headers.get('access-control-allow-headers')}`);
    console.log('\n');

    // Test 2: Supabase client invoke
    console.log('Test 2: Supabase client invoke');
    try {
      const { data, error } = await supabase.functions.invoke('send-verification-email', {
        body: {
          email: 'test@example.com',
          name: 'Test User',
          verificationToken: 'test-token-123',
          userType: 'cat-parent',
        },
      });

      if (error) {
        console.log('❌ Invoke error:', error.message);
        if (error.message.includes('CORS')) {
          console.log('\n⚠️  CORS error detected!');
          console.log('To fix this:');
          console.log('1. Go to your Supabase Dashboard');
          console.log('2. Navigate to Edge Functions');
          console.log('3. Add your domain to CORS allowed origins');
          console.log(`4. Add these origins: ${process.env.VITE_APP_URL}, http://localhost:5173`);
        }
      } else {
        console.log('✅ Invoke successful:', data);
      }
    } catch (invokeError) {
      console.log('❌ Invoke exception:', invokeError.message);
    }

    // Test 3: Check verify-email function
    console.log('\nTest 3: Testing verify-email Edge Function');
    const verifyResponse = await fetch(`${supabaseUrl}/functions/v1/verify-email?token=test`, {
      method: 'GET',
      headers: {
        'Origin': process.env.VITE_APP_URL || 'http://localhost:5173',
      },
    });

    console.log(`GET response status: ${verifyResponse.status}`);
    console.log(`Location header: ${verifyResponse.headers.get('location')}`);
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }

  console.log('\n📝 Summary:');
  console.log('If you see CORS errors, you need to:');
  console.log('1. Go to Supabase Dashboard > Edge Functions');
  console.log('2. Click on your function');
  console.log('3. Add CORS origins in the function settings');
  console.log('4. Include both production URL and http://localhost:5173');
  console.log('5. Deploy the function again after changes');
}

testEdgeFunctionCORS();