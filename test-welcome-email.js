// Test script to directly invoke the welcome email Edge Function
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

async function testWelcomeEmail() {
  console.log('🚀 Testing welcome email Edge Function...');
  console.log('📧 Sending to: denniserciaaguila@gmail.com');
  
  const payload = {
    email: 'denniserciaaguila@gmail.com',
    name: 'Dennis Test',
    waitlistPosition: 123,
    userType: 'cat-parent'
  };
  
  console.log('📦 Payload:', payload);
  
  try {
    const { data, error } = await supabase.functions.invoke('send-welcome-email', {
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
    }
  } catch (err) {
    console.error('❌ Exception:', err);
    console.error('❌ Exception details:', JSON.stringify(err, null, 2));
  }
}

// Run the test
testWelcomeEmail();