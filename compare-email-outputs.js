// Compare welcome vs verification email outputs
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function compareEmails() {
  console.log('📧 Testing both email functions...');
  
  // Test verification email
  console.log('\n🔍 Testing VERIFICATION email:');
  try {
    const verificationResult = await supabase.functions.invoke('send-verification-email', {
      body: {
        email: 'denniserciaaguila@gmail.com',
        name: 'Compare Test',
        verificationToken: 'compare_test_verification',
        userType: 'cat-parent'
      }
    });
    
    console.log('✅ Verification email result:', verificationResult.data);
    console.log('❌ Verification email error:', verificationResult.error);
  } catch (err) {
    console.log('❌ Verification email exception:', err.message);
  }
  
  // Test welcome email
  console.log('\n🎉 Testing WELCOME email:');
  try {
    const welcomeResult = await supabase.functions.invoke('send-welcome-email', {
      body: {
        email: 'denniserciaaguila@gmail.com',
        name: 'Compare Test',
        waitlistPosition: 999,
        userType: 'cat-parent'
      }
    });
    
    console.log('✅ Welcome email result:', welcomeResult.data);
    console.log('❌ Welcome email error:', welcomeResult.error);
  } catch (err) {
    console.log('❌ Welcome email exception:', err.message);
  }
  
  console.log('\n💡 Both emails should be sent successfully.');
  console.log('🔍 Compare the logos in both emails - they should be identical now.');
  console.log('📧 Check your email for both messages and compare the logo display.');
}

compareEmails();