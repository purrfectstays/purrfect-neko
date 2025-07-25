/**
 * Browser Console Test for send-welcome-email Edge Function
 * Copy and paste this into your browser console while on the Purrfect Stays site
 */

// Quick test function
async function testWelcomeEmail() {
  console.log('🧪 Testing send-welcome-email Edge Function...');
  
  // Get environment values from the current page
  const supabaseUrl = window.__ENV?.VITE_SUPABASE_URL || import.meta.env?.VITE_SUPABASE_URL;
  const supabaseAnonKey = window.__ENV?.VITE_SUPABASE_ANON_KEY || import.meta.env?.VITE_SUPABASE_ANON_KEY;
  
  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('❌ Cannot find Supabase configuration. Are you on the Purrfect Stays site?');
    return;
  }

  // Test data - change email to your test email
  const testData = {
    email: 'test@example.com', // CHANGE THIS to your email
    name: 'Test User',
    waitlistPosition: 42,
    userType: 'cat-parent'
  };

  console.log('📧 Sending test email to:', testData.email);
  console.log('🔧 Using Supabase URL:', supabaseUrl);

  try {
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

    const result = await response.json();
    
    if (response.ok) {
      console.log('✅ Success! Email sent with message ID:', result.messageId);
      console.log('📝 Response:', result);
      if (result.note) {
        console.log('⚠️  Note:', result.note);
      }
    } else {
      console.error('❌ Failed with status:', response.status);
      console.error('❌ Error:', result);
    }

    // Test invalid request
    console.log('\n🧪 Testing error handling with invalid data...');
    const errorResponse = await fetch(`${supabaseUrl}/functions/v1/send-welcome-email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${supabaseAnonKey}`,
        'apikey': supabaseAnonKey,
        'Origin': window.location.origin
      },
      body: JSON.stringify({
        email: 'invalid-email',
        name: 'Test',
        waitlistPosition: 1,
        userType: 'cat-parent'
      })
    });

    const errorResult = await errorResponse.json();
    console.log('📝 Error handling test:', errorResponse.status === 400 ? '✅ Passed' : '❌ Failed');
    console.log('📝 Error response:', errorResult);

  } catch (error) {
    console.error('❌ Network error:', error);
  }
}

// Run the test
testWelcomeEmail();

// Additional debugging commands
console.log('\n📚 Additional debugging commands:');
console.log('- Check Supabase logs: Go to Supabase Dashboard > Edge Functions > Logs');
console.log('- Test with your email: Change test@example.com to your actual email');
console.log('- Check spam folder: Welcome emails might go to spam initially');