/**
 * Debug script for Edge Function 401 error
 * Run this in your browser console on purrfectstays.org
 */

// Debug function to check authentication
async function debugEdgeFunction() {
  console.log('🔍 Debugging Edge Function Authentication...\n');
  
  // Check if we can access environment variables
  const supabaseUrl = window.__ENV?.VITE_SUPABASE_URL || 
                      import.meta?.env?.VITE_SUPABASE_URL ||
                      'https://fahdkcnclzftojski.supabase.co'; // Your Supabase URL
  
  const supabaseAnonKey = window.__ENV?.VITE_SUPABASE_ANON_KEY || 
                          import.meta?.env?.VITE_SUPABASE_ANON_KEY;
  
  console.log('📌 Supabase URL:', supabaseUrl);
  console.log('📌 Anon Key Present:', !!supabaseAnonKey);
  console.log('📌 Anon Key Length:', supabaseAnonKey?.length);
  console.log('📌 Current Origin:', window.location.origin);
  
  if (!supabaseAnonKey) {
    console.error('❌ Cannot find SUPABASE_ANON_KEY in environment');
    console.log('\n💡 Try running this instead to get the key from your Supabase instance:');
    console.log('1. Open your Supabase dashboard');
    console.log('2. Go to Settings > API');
    console.log('3. Copy the "anon public" key');
    return;
  }
  
  // Test data
  const testData = {
    email: 'debug@test.com',
    name: 'Debug Test',
    waitlistPosition: 1,
    userType: 'cat-parent'
  };
  
  console.log('\n📧 Testing with data:', testData);
  
  // Test the Edge Function
  try {
    console.log('\n🚀 Sending request to Edge Function...');
    
    const response = await fetch(`${supabaseUrl}/functions/v1/send-welcome-email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${supabaseAnonKey}`,
        'apikey': supabaseAnonKey,
        'Origin': window.location.origin
      },
      body: JSON.stringify(testData)
    });
    
    console.log('\n📊 Response Status:', response.status);
    console.log('📊 Response Headers:');
    response.headers.forEach((value, key) => {
      console.log(`   ${key}: ${value}`);
    });
    
    const responseText = await response.text();
    let responseData;
    
    try {
      responseData = JSON.parse(responseText);
    } catch {
      responseData = responseText;
    }
    
    console.log('\n📄 Response Body:', responseData);
    
    if (response.status === 401) {
      console.error('\n❌ Authentication Failed!');
      console.log('\n🔧 Troubleshooting Steps:');
      console.log('1. Check Edge Function logs in Supabase dashboard');
      console.log('2. Verify SUPABASE_ANON_KEY is set in Edge Function environment');
      console.log('3. Ensure the Edge Function has the correct CORS settings');
      console.log('4. Check if the anon key matches between frontend and Edge Function');
      
      console.log('\n💡 To fix in Supabase Dashboard:');
      console.log('1. Go to Edge Functions > send-welcome-email');
      console.log('2. Click "Secrets" or "Environment Variables"');
      console.log('3. Add SUPABASE_ANON_KEY with your project\'s anon key');
      console.log('4. Add ALLOWED_ORIGINS with: https://purrfectstays.org,https://www.purrfectstays.org');
      console.log('5. Redeploy the function');
    } else if (response.ok) {
      console.log('\n✅ Success! Edge Function is working properly');
    } else {
      console.log('\n⚠️ Request failed with status:', response.status);
    }
    
  } catch (error) {
    console.error('\n❌ Network Error:', error);
    console.log('\n💡 This might be a CORS issue. Check:');
    console.log('1. Edge Function CORS configuration');
    console.log('2. Allowed origins in Edge Function');
  }
}

// Run the debug function
debugEdgeFunction();