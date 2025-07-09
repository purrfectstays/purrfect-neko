// Test script to directly invoke the verification email Edge Function
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing environment variables');
  console.error('Please ensure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set in .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testVerificationEmail() {
  console.log('🚀 Testing verification email Edge Function...');
  console.log('📧 Sending to: denniserciaaguila@gmail.com');
  
  const payload = {
    email: 'denniserciaaguila@gmail.com',
    name: 'Dennis Test',
    verificationToken: 'test_token_123456789',
    userType: 'cat-parent'
  };
  
  console.log('📦 Payload:', payload);
  
  try {
    const { data, error } = await supabase.functions.invoke('send-verification-email', {
      body: payload
    });
    
    if (error) {
      console.error('❌ Edge Function error:', error);
      console.error('❌ Error details:', JSON.stringify(error, null, 2));
      
      // Try to read the error response body
      if (error.context && error.context.body) {
        try {
          const errorBody = await error.context.text();
          console.error('❌ Error response body:', errorBody);
        } catch (e) {
          console.error('❌ Could not read error body');
        }
      }
    } else {
      console.log('✅ Success! Response:', data);
      console.log('📧 Check your email (including spam folder)');
      console.log('🖼️ The email should now display the proper Purrfect Stays logo (cats + house)');
    }
  } catch (err) {
    console.error('❌ Exception:', err);
    console.error('❌ Exception details:', JSON.stringify(err, null, 2));
  }
}

// Run the test
testVerificationEmail();