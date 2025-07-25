#!/bin/bash

# send-welcome-email Edge Function Test Script
# Update these variables with your actual values
SUPABASE_URL="YOUR_SUPABASE_URL"
SUPABASE_ANON_KEY="YOUR_ANON_KEY"
TEST_EMAIL="test@example.com"

echo "🧪 Testing send-welcome-email Edge Function"
echo "================================================"

# Test 1: Valid Request
echo -e "\n✅ Test 1: Valid Request - Cat Parent"
curl -X POST "${SUPABASE_URL}/functions/v1/send-welcome-email" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${SUPABASE_ANON_KEY}" \
  -H "apikey: ${SUPABASE_ANON_KEY}" \
  -H "Origin: http://localhost:5173" \
  -d '{
    "email": "'${TEST_EMAIL}'",
    "name": "Test User",
    "waitlistPosition": 42,
    "userType": "cat-parent"
  }' \
  -w "\nHTTP Status: %{http_code}\n"

sleep 2

# Test 2: Missing Authorization
echo -e "\n\n❌ Test 2: Missing Authorization (Should fail with 401)"
curl -X POST "${SUPABASE_URL}/functions/v1/send-welcome-email" \
  -H "Content-Type: application/json" \
  -H "Origin: http://localhost:5173" \
  -d '{
    "email": "'${TEST_EMAIL}'",
    "name": "Test User",
    "waitlistPosition": 1,
    "userType": "cat-parent"
  }' \
  -w "\nHTTP Status: %{http_code}\n"

sleep 2

# Test 3: Invalid Email
echo -e "\n\n❌ Test 3: Invalid Email Format (Should fail with 400)"
curl -X POST "${SUPABASE_URL}/functions/v1/send-welcome-email" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${SUPABASE_ANON_KEY}" \
  -H "apikey: ${SUPABASE_ANON_KEY}" \
  -H "Origin: http://localhost:5173" \
  -d '{
    "email": "invalid-email",
    "name": "Test User",
    "waitlistPosition": 1,
    "userType": "cat-parent"
  }' \
  -w "\nHTTP Status: %{http_code}\n"

sleep 2

# Test 4: CORS Preflight
echo -e "\n\n🔧 Test 4: CORS Preflight Request"
curl -X OPTIONS "${SUPABASE_URL}/functions/v1/send-welcome-email" \
  -H "Origin: http://localhost:5173" \
  -H "Access-Control-Request-Method: POST" \
  -H "Access-Control-Request-Headers: content-type,authorization" \
  -i

echo -e "\n\n================================================"
echo "📊 Test Summary:"
echo "- Test 1 should return 200 with success: true and messageId"
echo "- Test 2 should return 401 with 'Missing authorization header'"
echo "- Test 3 should return 400 with 'Invalid email format'"
echo "- Test 4 should return 200 with CORS headers"
echo ""
echo "📝 Next Steps:"
echo "1. Check your email (including spam) for Test 1"
echo "2. Review Supabase Edge Function logs for details"
echo "3. Verify RESEND_API_KEY is set in Edge Function environment"