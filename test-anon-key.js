// Test if anon key is working properly
const testAnonKey = async () => {
  console.log('🔑 Testing anon key authentication...\n');
  
  const SUPABASE_URL = 'https://fahqkxrakcizftopskki.supabase.co';
  const ANON_KEY = 'sb_publishable_t9qTtsvsmmU_wfVDyL-rjQ_g5mFNbST'; // Current anon key
  
  console.log('📊 Anon key analysis:');
  console.log(`   Length: ${ANON_KEY.length} characters`);
  console.log(`   Starts with: ${ANON_KEY.substring(0, 20)}...`);
  console.log(`   Expected: eyJ... and 100+ characters`);
  console.log();
  
  // Test basic Supabase connection with anon key
  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/waitlist_users?select=count`, {
      headers: {
        'Authorization': `Bearer ${ANON_KEY}`,
        'apikey': ANON_KEY,
        'Content-Type': 'application/json'
      }
    });
    
    console.log(`🔗 Basic Supabase API test: ${response.status}`);
    
    if (response.status === 401) {
      console.log('❌ ANON KEY IS INVALID OR EXPIRED');
      console.log('🔧 Solution: Get fresh anon key from Supabase dashboard');
      console.log('📍 URL: https://supabase.com/dashboard/project/fahqkxrakcizftopskki/settings/api');
    } else if (response.status === 200) {
      console.log('✅ Anon key working for basic API calls');
      console.log('🔍 Issue might be Edge Function specific authentication');
    }
  } catch (error) {
    console.error('❌ Connection test failed:', error.message);
  }
};

testAnonKey();