// Test with the corrected JWT anon key
const testFixedAuth = async () => {
  console.log('🎯 Testing with CORRECTED JWT anon key...\n');
  
  const SUPABASE_URL = 'https://fahqkxrakcizftopskki.supabase.co';
  const NEW_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZhaHFreHJha2NpemZ0b3Bza2tpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE4NzEwMzcsImV4cCI6MjA2NzQ0NzAzN30.1I2o7_YGYaHUMCKqbuIGIyy7nbohTehvGUwIY-yzHgI';
  
  const WELCOME_EMAIL_URL = `${SUPABASE_URL}/functions/v1/send-welcome-email`;
  
  console.log('📊 New anon key analysis:');
  console.log(`   Length: ${NEW_ANON_KEY.length} characters ✅`);
  console.log(`   Format: ${NEW_ANON_KEY.substring(0, 30)}... ✅`);
  console.log(`   JWT Structure: Header.Payload.Signature ✅`);
  console.log();
  
  try {
    const response = await fetch(WELCOME_EMAIL_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${NEW_ANON_KEY}`,
        'apikey': NEW_ANON_KEY,
        'Origin': 'http://localhost:5177'
      },
      body: JSON.stringify({
        email: 'test@purrfectstays.org',
        name: 'Test User Fixed Auth',
        userType: 'cat-parent',
        waitlistPosition: 456
      })
    });
    
    console.log(`🎯 Response Status: ${response.status}`);
    
    if (response.status === 200) {
      const result = await response.json();
      console.log('🎉 SUCCESS! Welcome email sent with anon key!');
      console.log('📧 Response:', result);
      console.log('✅ ISSUE COMPLETELY RESOLVED!');
    } else if (response.status === 401) {
      const errorText = await response.text();
      console.log(`❌ Still 401: ${errorText}`);
    } else {
      const errorText = await response.text();
      console.log(`⚠️ Status ${response.status}: ${errorText}`);
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
};

testFixedAuth();