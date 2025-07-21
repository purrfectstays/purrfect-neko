// Quick test to verify welcome email with new environment variables
const testWelcomeEmail = async () => {
  console.log('🧪 Testing welcome email with configured environment variables...\n');
  
  const SUPABASE_URL = 'https://fahqkxrakcizftopskki.supabase.co';
  const ANON_KEY = 'sb_publishable_t9qTtsvsmmU_wfVDyL-rjQ_g5mFNbST';
  
  const WELCOME_EMAIL_URL = `${SUPABASE_URL}/functions/v1/send-welcome-email`;
  
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
    
    console.log(`Status: ${response.status}`);
    const result = await response.text();
    console.log(`Response: ${result}`);
    
    if (response.status === 200) {
      console.log('✅ SUCCESS! Welcome email function is now working!');
    } else if (response.status === 401) {
      console.log('❌ Still getting 401 - Environment variables not propagated yet');
      console.log('💡 Try redeploying the Edge Functions in Supabase Dashboard');
    } else if (response.status === 500) {
      console.log('⚠️ 500 error - Check Supabase function logs for details');
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
};

testWelcomeEmail();