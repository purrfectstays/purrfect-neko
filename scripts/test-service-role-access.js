#!/usr/bin/env node

/**
 * Test script to verify service role database access
 * This script tests the database fixes implemented for Edge Functions
 */

import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';

// Load environment variables
config();

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('❌ Missing required environment variables:');
  console.error('   - VITE_SUPABASE_URL:', !!SUPABASE_URL);
  console.error('   - SUPABASE_SERVICE_ROLE_KEY:', !!SUPABASE_SERVICE_ROLE_KEY);
  process.exit(1);
}

// Create service role client
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});

async function testServiceRoleAccess() {
  console.log('🔍 Testing service role database access...\n');
  
  try {
    // Test 1: Check RLS status
    console.log('1️⃣ Testing RLS status check...');
    const { data: rlsStatus, error: rlsError } = await supabase.rpc('check_rls_status');
    
    if (rlsError) {
      console.error('❌ RLS status check failed:', rlsError.message);
      return false;
    }
    
    console.log('✅ RLS status check successful:');
    rlsStatus.forEach(status => {
      console.log(`   - ${status.table_name}: RLS ${status.rls_enabled ? 'enabled' : 'disabled'}, ${status.policy_count} policies, Service role bypass: ${status.service_role_bypass}`);
    });
    console.log();
    
    // Test 2: Test service role access function
    console.log('2️⃣ Testing service role access function...');
    const { data: accessTest, error: accessError } = await supabase.rpc('test_service_role_access');
    
    if (accessError) {
      console.error('❌ Service role access test failed:', accessError.message);
      return false;
    }
    
    console.log('✅ Service role access test successful:');
    console.log(`   - Is service role: ${accessTest.is_service_role}`);
    console.log(`   - Current role: ${accessTest.current_role}`);
    console.log(`   - User count: ${accessTest.user_count}`);
    console.log(`   - Test time: ${accessTest.test_time}`);
    console.log();
    
    // Test 3: Direct table access
    console.log('3️⃣ Testing direct table access...');
    const { data: users, error: usersError } = await supabase
      .from('waitlist_users')
      .select('id, email, is_verified, created_at')
      .limit(5);
    
    if (usersError) {
      console.error('❌ Direct table access failed:', usersError.message);
      return false;
    }
    
    console.log(`✅ Direct table access successful: ${users.length} users found`);
    console.log();
    
    // Test 4: Test verification function
    console.log('4️⃣ Testing verification function with dummy token...');
    const { data: verifyTest, error: verifyError } = await supabase.rpc('verify_email_with_token', {
      token_param: 'dummy-test-token-that-does-not-exist'
    });
    
    if (verifyError) {
      console.error('❌ Verification function test failed:', verifyError.message);
      return false;
    }
    
    console.log('✅ Verification function test successful:');
    console.log(`   - Success: ${verifyTest.success}`);
    console.log(`   - Error: ${verifyTest.error}`);
    console.log();
    
    // Test 5: Insert/Update test
    console.log('5️⃣ Testing insert/update operations...');
    
    // Insert test user
    const testUser = {
      name: 'Test User ' + Date.now(),
      email: 'test-' + Date.now() + '@example.com',
      user_type: 'cat-parent',
      verification_token: 'test-token-' + Date.now(),
      is_verified: false
    };
    
    const { data: insertedUser, error: insertError } = await supabase
      .from('waitlist_users')
      .insert(testUser)
      .select()
      .single();
    
    if (insertError) {
      console.error('❌ Insert test failed:', insertError.message);
      return false;
    }
    
    console.log('✅ Insert test successful:', insertedUser.email);
    
    // Update test
    const { data: updatedUser, error: updateError } = await supabase
      .from('waitlist_users')
      .update({ is_verified: true, verification_token: null })
      .eq('id', insertedUser.id)
      .select()
      .single();
    
    if (updateError) {
      console.error('❌ Update test failed:', updateError.message);
      return false;
    }
    
    console.log('✅ Update test successful:', updatedUser.is_verified);
    
    // Clean up test user
    const { error: deleteError } = await supabase
      .from('waitlist_users')
      .delete()
      .eq('id', insertedUser.id);
    
    if (deleteError) {
      console.warn('⚠️ Cleanup failed (non-critical):', deleteError.message);
    } else {
      console.log('🧹 Test user cleaned up successfully');
    }
    
    console.log();
    console.log('🎉 All tests passed! Service role access is working correctly.');
    return true;
    
  } catch (error) {
    console.error('❌ Unexpected error during testing:', error.message);
    return false;
  }
}

// Run the test
testServiceRoleAccess().then(success => {
  process.exit(success ? 0 : 1);
});