/**
 * Comprehensive Test Suite for send-welcome-email Edge Function
 * Tests authentication, validation, error handling, and email sending
 */

// Test configuration - update these with your actual values
const CONFIG = {
  SUPABASE_URL: process.env.VITE_SUPABASE_URL || 'YOUR_SUPABASE_URL',
  SUPABASE_ANON_KEY: process.env.VITE_SUPABASE_ANON_KEY || 'YOUR_ANON_KEY',
  TEST_EMAIL: 'test@example.com', // Change to your test email
  EDGE_FUNCTION_URL: '', // Will be constructed
};

CONFIG.EDGE_FUNCTION_URL = `${CONFIG.SUPABASE_URL}/functions/v1/send-welcome-email`;

// Test scenarios
const TEST_SCENARIOS = [
  {
    name: '✅ Valid Request - Cat Parent',
    data: {
      email: CONFIG.TEST_EMAIL,
      name: 'Test User',
      waitlistPosition: 42,
      userType: 'cat-parent'
    },
    headers: {
      'Authorization': `Bearer ${CONFIG.SUPABASE_ANON_KEY}`,
      'apikey': CONFIG.SUPABASE_ANON_KEY
    },
    expectedStatus: 200,
    expectSuccess: true
  },
  {
    name: '✅ Valid Request - Cattery Owner',
    data: {
      email: CONFIG.TEST_EMAIL,
      name: 'Cattery Test',
      waitlistPosition: 15,
      userType: 'cattery-owner'
    },
    headers: {
      'Authorization': `Bearer ${CONFIG.SUPABASE_ANON_KEY}`,
      'apikey': CONFIG.SUPABASE_ANON_KEY
    },
    expectedStatus: 200,
    expectSuccess: true
  },
  {
    name: '❌ Missing Authorization',
    data: {
      email: CONFIG.TEST_EMAIL,
      name: 'Test User',
      waitlistPosition: 1,
      userType: 'cat-parent'
    },
    headers: {},
    expectedStatus: 401,
    expectError: 'Missing authorization header'
  },
  {
    name: '❌ Invalid Email Format',
    data: {
      email: 'invalid-email',
      name: 'Test User',
      waitlistPosition: 1,
      userType: 'cat-parent'
    },
    headers: {
      'Authorization': `Bearer ${CONFIG.SUPABASE_ANON_KEY}`,
      'apikey': CONFIG.SUPABASE_ANON_KEY
    },
    expectedStatus: 400,
    expectError: 'Invalid email format'
  },
  {
    name: '❌ Missing Required Fields',
    data: {
      email: CONFIG.TEST_EMAIL,
      // Missing name, waitlistPosition, userType
    },
    headers: {
      'Authorization': `Bearer ${CONFIG.SUPABASE_ANON_KEY}`,
      'apikey': CONFIG.SUPABASE_ANON_KEY
    },
    expectedStatus: 400,
    expectError: 'required'
  },
  {
    name: '❌ Invalid User Type',
    data: {
      email: CONFIG.TEST_EMAIL,
      name: 'Test User',
      waitlistPosition: 1,
      userType: 'invalid-type'
    },
    headers: {
      'Authorization': `Bearer ${CONFIG.SUPABASE_ANON_KEY}`,
      'apikey': CONFIG.SUPABASE_ANON_KEY
    },
    expectedStatus: 400,
    expectError: 'User type must be'
  },
  {
    name: '❌ Invalid Authorization Token',
    data: {
      email: CONFIG.TEST_EMAIL,
      name: 'Test User',
      waitlistPosition: 1,
      userType: 'cat-parent'
    },
    headers: {
      'Authorization': 'Bearer invalid-token-here',
      'apikey': 'invalid-token-here'
    },
    expectedStatus: 401,
    expectError: 'Invalid authorization token'
  },
  {
    name: '🔧 Special Characters in Name',
    data: {
      email: CONFIG.TEST_EMAIL,
      name: 'Test <script>alert("XSS")</script> User',
      waitlistPosition: 100,
      userType: 'cat-parent'
    },
    headers: {
      'Authorization': `Bearer ${CONFIG.SUPABASE_ANON_KEY}`,
      'apikey': CONFIG.SUPABASE_ANON_KEY
    },
    expectedStatus: 200,
    expectSuccess: true,
    note: 'Should sanitize HTML in name'
  },
  {
    name: '🔧 Very Long Name',
    data: {
      email: CONFIG.TEST_EMAIL,
      name: 'A'.repeat(101), // Over 100 character limit
      waitlistPosition: 1,
      userType: 'cat-parent'
    },
    headers: {
      'Authorization': `Bearer ${CONFIG.SUPABASE_ANON_KEY}`,
      'apikey': CONFIG.SUPABASE_ANON_KEY
    },
    expectedStatus: 400,
    expectError: 'Name must be less than 100 characters'
  },
  {
    name: '🔧 CORS Preflight Request',
    method: 'OPTIONS',
    headers: {
      'Origin': 'http://localhost:5173',
      'Access-Control-Request-Method': 'POST',
      'Access-Control-Request-Headers': 'content-type,authorization'
    },
    expectedStatus: 200,
    checkCORS: true
  }
];

// Test runner
async function runTest(scenario) {
  console.log(`\n🧪 Testing: ${scenario.name}`);
  
  try {
    const options = {
      method: scenario.method || 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Origin': 'http://localhost:5173',
        ...scenario.headers
      }
    };

    if (scenario.data) {
      options.body = JSON.stringify(scenario.data);
    }

    const response = await fetch(CONFIG.EDGE_FUNCTION_URL, options);
    const responseText = await response.text();
    let responseData;
    
    try {
      responseData = JSON.parse(responseText);
    } catch {
      responseData = responseText;
    }

    console.log(`📊 Status: ${response.status}`);
    console.log(`📄 Response:`, responseData);

    // Check CORS headers
    if (scenario.checkCORS) {
      const corsHeaders = {
        'Access-Control-Allow-Origin': response.headers.get('Access-Control-Allow-Origin'),
        'Access-Control-Allow-Methods': response.headers.get('Access-Control-Allow-Methods'),
        'Access-Control-Allow-Headers': response.headers.get('Access-Control-Allow-Headers')
      };
      console.log(`🌐 CORS Headers:`, corsHeaders);
    }

    // Validate response
    if (response.status !== scenario.expectedStatus) {
      console.error(`❌ Expected status ${scenario.expectedStatus}, got ${response.status}`);
      return false;
    }

    if (scenario.expectSuccess && (!responseData.success || !responseData.messageId)) {
      console.error(`❌ Expected success response with messageId`);
      return false;
    }

    if (scenario.expectError) {
      const errorMessage = responseData.error || responseData.details?.join(' ') || '';
      if (!errorMessage.toLowerCase().includes(scenario.expectError.toLowerCase())) {
        console.error(`❌ Expected error containing "${scenario.expectError}", got "${errorMessage}"`);
        return false;
      }
    }

    if (scenario.note) {
      console.log(`📝 Note: ${scenario.note}`);
    }

    console.log(`✅ Test passed!`);
    return true;

  } catch (error) {
    console.error(`❌ Test failed with error:`, error.message);
    return false;
  }
}

// Main test execution
async function runAllTests() {
  console.log('🚀 Starting send-welcome-email Edge Function Tests');
  console.log('📋 Configuration:', {
    url: CONFIG.EDGE_FUNCTION_URL,
    testEmail: CONFIG.TEST_EMAIL
  });

  if (CONFIG.SUPABASE_URL === 'YOUR_SUPABASE_URL') {
    console.error('\n⚠️  Please update CONFIG values with your actual Supabase credentials!');
    return;
  }

  const results = {
    total: TEST_SCENARIOS.length,
    passed: 0,
    failed: 0
  };

  for (const scenario of TEST_SCENARIOS) {
    const passed = await runTest(scenario);
    if (passed) {
      results.passed++;
    } else {
      results.failed++;
    }
    
    // Add delay between tests to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  console.log('\n📊 Test Summary:');
  console.log(`Total: ${results.total}`);
  console.log(`✅ Passed: ${results.passed}`);
  console.log(`❌ Failed: ${results.failed}`);
  console.log(`Success Rate: ${((results.passed / results.total) * 100).toFixed(1)}%`);

  if (results.passed === results.total) {
    console.log('\n🎉 All tests passed! The send-welcome-email function is working properly.');
  } else {
    console.log('\n⚠️  Some tests failed. Please review the errors above.');
  }
}

// Add command to check if Resend API key is configured
async function checkResendConfig() {
  console.log('\n🔧 Checking Resend API Configuration...');
  
  // This would need to be done through Supabase dashboard or CLI
  console.log('📝 To verify Resend configuration:');
  console.log('1. Go to your Supabase dashboard');
  console.log('2. Navigate to Edge Functions > send-welcome-email');
  console.log('3. Check that RESEND_API_KEY environment variable is set');
  console.log('4. Verify the key starts with "re_"');
  console.log('5. Test email sending with a valid email address');
}

// Run tests
console.log('='.repeat(60));
runAllTests().then(() => {
  console.log('='.repeat(60));
  checkResendConfig();
});