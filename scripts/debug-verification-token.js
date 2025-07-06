/**
 * Debug script to check verification tokens
 * Usage: node scripts/debug-verification-token.js [email]
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: join(__dirname, '..', '.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase configuration. Please check your .env file.');
  console.error('Need: VITE_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

// Create Supabase client with service role key (bypasses RLS)
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function debugVerificationToken(email) {
  console.log('🔍 Debugging verification tokens...\n');

  try {
    // If email provided, look up specific user
    if (email) {
      console.log(`📧 Looking up user: ${email}`);
      
      const { data: user, error } = await supabase
        .from('waitlist_users')
        .select('*')
        .eq('email', email)
        .single();

      if (error) {
        console.error('❌ Error finding user:', error.message);
        return;
      }

      if (!user) {
        console.log('❌ No user found with that email');
        return;
      }

      console.log('\n👤 User Details:');
      console.log(`- ID: ${user.id}`);
      console.log(`- Name: ${user.name}`);
      console.log(`- Email: ${user.email}`);
      console.log(`- Type: ${user.user_type}`);
      console.log(`- Verified: ${user.is_verified ? '✅ Yes' : '❌ No'}`);
      console.log(`- Quiz Completed: ${user.quiz_completed ? '✅ Yes' : '❌ No'}`);
      console.log(`- Created: ${new Date(user.created_at).toLocaleString()}`);
      
      if (user.verification_token) {
        console.log(`\n🔑 Verification Token:`);
        console.log(`- Token: ${user.verification_token}`);
        console.log(`- Length: ${user.verification_token.length} characters`);
        
        // Generate the verification URL
        const verificationUrl = `${supabaseUrl}/functions/v1/verify-email?token=${encodeURIComponent(user.verification_token)}&redirect_url=${encodeURIComponent(process.env.VITE_APP_URL || 'https://purrfect-landingpage.netlify.app')}`;
        console.log(`\n🔗 Verification URL:`);
        console.log(verificationUrl);
      } else {
        console.log('\n⚠️  No verification token (user might be already verified)');
      }
    }

    // Show recent users with tokens
    console.log('\n📊 Recent unverified users with tokens:');
    const { data: recentUsers, error: listError } = await supabase
      .from('waitlist_users')
      .select('email, name, verification_token, is_verified, created_at')
      .eq('is_verified', false)
      .not('verification_token', 'is', null)
      .order('created_at', { ascending: false })
      .limit(5);

    if (listError) {
      console.error('❌ Error listing users:', listError.message);
      return;
    }

    if (!recentUsers || recentUsers.length === 0) {
      console.log('No unverified users with tokens found');
    } else {
      recentUsers.forEach((user, index) => {
        console.log(`\n${index + 1}. ${user.email}`);
        console.log(`   - Name: ${user.name}`);
        console.log(`   - Token: ${user.verification_token.substring(0, 8)}...`);
        console.log(`   - Created: ${new Date(user.created_at).toLocaleString()}`);
      });
    }

    // Check for common issues
    console.log('\n🔧 Checking for common issues:');
    
    // Check for duplicate tokens
    const { data: tokenCounts } = await supabase
      .from('waitlist_users')
      .select('verification_token')
      .not('verification_token', 'is', null);
    
    const tokenMap = {};
    tokenCounts?.forEach(row => {
      tokenMap[row.verification_token] = (tokenMap[row.verification_token] || 0) + 1;
    });
    
    const duplicates = Object.entries(tokenMap).filter(([_, count]) => count > 1);
    if (duplicates.length > 0) {
      console.log('⚠️  Found duplicate tokens:', duplicates.length);
    } else {
      console.log('✅ No duplicate tokens found');
    }

    // Check token format
    const invalidTokens = tokenCounts?.filter(row => {
      const token = row.verification_token;
      // Check if it's a valid UUID format
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      return !uuidRegex.test(token);
    });

    if (invalidTokens?.length > 0) {
      console.log(`⚠️  Found ${invalidTokens.length} tokens with invalid format`);
    } else {
      console.log('✅ All tokens have valid UUID format');
    }

  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

// Get email from command line argument
const email = process.argv[2];
debugVerificationToken(email);