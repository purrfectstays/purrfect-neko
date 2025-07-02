# 🗄️ Database Migration Verification - Pre-Launch

## 📋 CRITICAL MIGRATIONS TO VERIFY

### **Recent Security & Compliance Migrations**
1. **`20250701_secure_rls_policies.sql`** ⚠️ CRITICAL
   - Updated RLS policies for email-based access control
   - Fixed security vulnerabilities in previous policies
   - **Must be applied to production**

2. **`20250701_gdpr_compliance.sql`** 📋 IMPORTANT
   - GDPR compliance tables (data exports, deletions)
   - Required for EU data protection compliance
   - **Should be applied before launch**

3. **`20250630_fix_city_column.sql`** 🔧 REQUIRED
   - Regional tracking fixes
   - **Must be applied for geolocation features**

### **Core System Migrations**
4. **`20250626_add_regional_tracking.sql`** 🌍 REQUIRED
   - Regional limits and tracking system
   - **Essential for waitlist position features**

5. **`20250620210947_floating_sound.sql`** 📧 REQUIRED
   - Latest quiz and verification system updates
   - **Essential for user registration flow**

---

## ✅ VERIFICATION CHECKLIST

### **1. Check Current Production Database Schema**

**Run in Supabase SQL Editor:**
```sql
-- Verify critical tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name IN (
    'waitlist_users',
    'quiz_responses', 
    'verification_tokens',
    'quiz_sessions',
    'regional_limits',
    'data_export_requests',
    'data_deletion_requests'
  );

-- Check RLS policies are active
SELECT schemaname, tablename, policyname, cmd, qual 
FROM pg_policies 
WHERE schemaname = 'public';

-- Verify recent migration functions exist
SELECT routine_name 
FROM information_schema.routines 
WHERE routine_schema = 'public' 
  AND routine_name IN (
    'validate_user_email_access',
    'cleanup_expired_verification_data'
  );
```

### **2. Test RLS Policies Work Correctly**

**Test Commands:**
```sql
-- Test user data access (should fail without proper email)
SELECT * FROM waitlist_users LIMIT 1;

-- Test verification token access
SELECT * FROM verification_tokens LIMIT 1;

-- Test regional limits (should work - public data)
SELECT * FROM regional_limits;
```

### **3. Verify Migration Application Status**

**Check Migration History:**
```sql
-- If using Supabase CLI migrations
SELECT * FROM supabase_migrations.schema_migrations 
ORDER BY created_at DESC;

-- Manual check for recent schema changes
SELECT obj_description(c.oid, 'pg_class') as comment
FROM pg_class c
JOIN pg_namespace n ON n.oid = c.relnamespace
WHERE n.nspname = 'public' 
  AND c.relkind = 'r'
  AND c.relname IN ('data_export_requests', 'data_deletion_requests');
```

---

## 🚨 MANUAL MIGRATION APPLICATION

**If migrations are not applied, run in this order:**

### **Step 1: Core System (if needed)**
```bash
# Apply regional tracking
psql -f supabase/migrations/20250626_add_regional_tracking.sql

# Apply city column fix  
psql -f supabase/migrations/20250630_fix_city_column.sql
```

### **Step 2: Security & Compliance (CRITICAL)**
```bash
# Apply GDPR compliance
psql -f supabase/migrations/20250701_gdpr_compliance.sql

# Apply security fixes (MOST IMPORTANT)
psql -f supabase/migrations/20250701_secure_rls_policies.sql
```

### **Step 3: Verification**
```bash
# Test database connection
psql -c "SELECT version();"

# Verify table structure
psql -c "\dt"

# Test RLS policies
psql -c "SELECT * FROM pg_policies WHERE schemaname = 'public';"
```

---

## ⚠️ LAUNCH BLOCKERS

**DO NOT LAUNCH if any of these are missing:**
- [ ] `waitlist_users` table with proper RLS policies
- [ ] `verification_tokens` table with secure access
- [ ] `quiz_responses` table with user-based access
- [ ] `regional_limits` table with public read access
- [ ] Updated RLS policies from `20250701_secure_rls_policies.sql`

**GDPR Compliance Tables (highly recommended):**
- [ ] `data_export_requests` table
- [ ] `data_deletion_requests` table  
- [ ] `data_exports` table

---

## 🎯 NEXT STEPS AFTER VERIFICATION

1. **✅ All migrations applied** → Proceed to environment variable setup
2. **❌ Missing migrations** → Apply missing migrations first
3. **⚠️ RLS policy issues** → Must fix before launch (security critical)

**Estimated Time:** 1-2 hours for full verification and fixes