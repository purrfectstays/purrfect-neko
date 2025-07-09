// Debug script to check what's happening with the verification email logo
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function debugVerificationEmail() {
  console.log('🔍 Debug verification email Edge Function...');
  
  const payload = {
    email: 'denniserciaaguila@gmail.com',
    name: 'Debug Test',
    verificationToken: 'debug_token_123',
    userType: 'cat-parent'
  };
  
  console.log('📦 Sending payload:', JSON.stringify(payload, null, 2));
  console.log('🌐 Expected logo URL should be: https://purrfect-landingpage.netlify.app/logo-email.png');
  
  try {
    const { data, error } = await supabase.functions.invoke('send-verification-email', {
      body: payload
    });
    
    if (error) {
      console.error('❌ Edge Function error:', error);
    } else {
      console.log('✅ Function response:', data);
      console.log('');
      console.log('📧 Check the email you receive and look at the logo source in the HTML');
      console.log('🔍 The logo should be loading from: https://purrfect-landingpage.netlify.app/logo-email.png');
      console.log('❌ If it shows a broken image or generic icon, there\'s still an issue');
    }
  } catch (err) {
    console.error('❌ Exception:', err);
  }
}

// Run the debug
debugVerificationEmail();