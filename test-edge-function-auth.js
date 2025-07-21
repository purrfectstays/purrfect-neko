// Test Edge Function authentication specifically
const testEdgeFunctionAuth = async () => {
  console.log('🧪 Testing Edge Function authentication...\n');
  
  const SUPABASE_URL = 'https://fahqkxrakcizftopskki.supabase.co';
  const ANON_KEY = 'sb_publishable_t9qTtsvsmmU_wfVDyL-rjQ_g5mFNbST';
  
  const WELCOME_EMAIL_URL = `${SUPABASE_URL}/functions/v1/send-welcome-email`;
  
  console.log('📧 Testing welcome email with current anon key...');
  console.log(`   URL: ${WELCOME_EMAIL_URL}`);
  console.log(`   Anon Key: ${ANON_KEY.substring(0, 20)}...`);
  console.log();
  
  try {
    const response = await fetch(WELCOME_EMAIL_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${ANON_KEY}`,
        'apikey': ANON_KEY,
        'Origin': 'http://localhost:5177'
      },
      body: JSON.stringify({
        email: 'test@purrfectstays.org',
        name: 'Test User',
        userType: 'cat-parent',
        waitlistPosition: 123
      })
    });
    
    console.log(`📊 Response Status: ${response.status}`);
    
    if (response.status === 401) {
      const errorText = await response.text();
      console.log(`❌ 401 Error Details: ${errorText}`);
      
      // Check if it's JWT related
      if (errorText.includes('Invalid JWT') || errorText.includes('JWT')) {
        console.log('🔧 SOLUTION: The anon key format might be incorrect for Edge Functions');
        console.log('📋 ACTION REQUIRED:');
        console.log('   1. Go to: https://supabase.com/dashboard/project/fahqkxrakcizftopskki/settings/api');
        console.log('   2. Copy the complete anon key (should start with "eyJ" and be 100+ chars)');
        console.log('   3. Update VITE_SUPABASE_ANON_KEY in .env file');
        console.log('   4. Restart npm run dev');
      }
    } else if (response.status === 200) {
      const result = await response.json();
      console.log('✅ SUCCESS! Edge Function working with anon key');
      console.log('📧 Result:', result);
    } else {
      const errorText = await response.text();
      console.log(`⚠️ Unexpected status ${response.status}: ${errorText}`);
    }
    
  } catch (error) {
    console.error('❌ Request failed:', error.message);
  }
};

testEdgeFunctionAuth();