# Purrfect Stays - Complete Testing & Validation Script
# BMad Orchestrator - Nuclear Option Final Validation

param(
    [string]$ProjectId = "",
    [string]$AnonKey = ""
)

Write-Host "🎯 BMAD ORCHESTRATOR - COMPLETE SYSTEM VALIDATION" -ForegroundColor Cyan
Write-Host "=================================================" -ForegroundColor Cyan

if (-not $ProjectId -or -not $AnonKey) {
    Write-Host "❌ Missing parameters. Usage:" -ForegroundColor Red
    Write-Host ".\complete-testing-script.ps1 -ProjectId 'your-project-id' -AnonKey 'your-anon-key'" -ForegroundColor Yellow
    exit 1
}

$projectUrl = "https://$ProjectId.supabase.co"
$testResults = @()

# Function to test API endpoint
function Test-ApiEndpoint {
    param($Url, $Method = "GET", $Headers = @{}, $Body = $null, $Description)
    
    Write-Host "🧪 Testing: $Description" -ForegroundColor Yellow
    
    try {
        $response = Invoke-RestMethod -Uri $Url -Method $Method -Headers $Headers -Body $Body -ErrorAction Stop
        Write-Host "✅ SUCCESS: $Description" -ForegroundColor Green
        return @{ Status = "SUCCESS"; Description = $Description; Response = $response }
    } catch {
        Write-Host "❌ FAILED: $Description - $($_.Exception.Message)" -ForegroundColor Red
        return @{ Status = "FAILED"; Description = $Description; Error = $_.Exception.Message }
    }
}

Write-Host ""
Write-Host "🔧 PHASE 1: ENVIRONMENT VALIDATION" -ForegroundColor Cyan
Write-Host "===================================" -ForegroundColor Cyan

# Check local environment file
if (Test-Path ".env") {
    Write-Host "✅ .env file exists" -ForegroundColor Green
    $envContent = Get-Content ".env"
    
    if ($envContent -match "VITE_SUPABASE_URL.*$ProjectId") {
        Write-Host "✅ VITE_SUPABASE_URL correctly configured" -ForegroundColor Green
    } else {
        Write-Host "❌ VITE_SUPABASE_URL not configured for new project" -ForegroundColor Red
    }
    
    if ($envContent -match "VITE_SUPABASE_ANON_KEY.*eyJ") {
        Write-Host "✅ VITE_SUPABASE_ANON_KEY is JWT format" -ForegroundColor Green
    } else {
        Write-Host "❌ VITE_SUPABASE_ANON_KEY is not JWT format" -ForegroundColor Red
    }
} else {
    Write-Host "❌ .env file not found" -ForegroundColor Red
}

Write-Host ""
Write-Host "🗄️ PHASE 2: DATABASE CONNECTIVITY" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan

# Test database connection via REST API
$headers = @{
    "apikey" = $AnonKey
    "Authorization" = "Bearer $AnonKey"
    "Content-Type" = "application/json"
}

$testResults += Test-ApiEndpoint -Url "$projectUrl/rest/v1/waitlist_users?select=count" -Headers $headers -Description "Database connection test"

Write-Host ""
Write-Host "⚡ PHASE 3: EDGE FUNCTIONS TESTING" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan

# Test welcome email function
$welcomeEmailBody = @{
    email = "test@bmadorchestrator.com"
    name = "BMad Test User"
    userType = "cat_parent"
} | ConvertTo-Json

$testResults += Test-ApiEndpoint -Url "$projectUrl/functions/v1/send-welcome-email" -Method "POST" -Headers $headers -Body $welcomeEmailBody -Description "Welcome email function"

# Test verification email function
$verificationBody = @{
    email = "test@bmadorchestrator.com"
    name = "BMad Test User"
} | ConvertTo-Json

$testResults += Test-ApiEndpoint -Url "$projectUrl/functions/v1/send-verification-email" -Method "POST" -Headers $headers -Body $verificationBody -Description "Verification email function"

Write-Host ""
Write-Host "🏗️ PHASE 4: BUILD SYSTEM VALIDATION" -ForegroundColor Cyan
Write-Host "====================================" -ForegroundColor Cyan

# Test TypeScript compilation
Write-Host "🔍 Running TypeScript check..." -ForegroundColor Yellow
try {
    $tscResult = npm run typecheck 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ TypeScript compilation successful" -ForegroundColor Green
        $testResults += @{ Status = "SUCCESS"; Description = "TypeScript compilation"; Response = "No errors" }
    } else {
        Write-Host "❌ TypeScript compilation failed" -ForegroundColor Red
        $testResults += @{ Status = "FAILED"; Description = "TypeScript compilation"; Error = $tscResult }
    }
} catch {
    Write-Host "❌ Failed to run TypeScript check" -ForegroundColor Red
}

# Test linting
Write-Host "🔍 Running ESLint..." -ForegroundColor Yellow
try {
    $lintResult = npm run lint 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Linting successful" -ForegroundColor Green
        $testResults += @{ Status = "SUCCESS"; Description = "ESLint validation"; Response = "No errors" }
    } else {
        Write-Host "❌ Linting failed" -ForegroundColor Red
        $testResults += @{ Status = "FAILED"; Description = "ESLint validation"; Error = $lintResult }
    }
} catch {
    Write-Host "❌ Failed to run linting" -ForegroundColor Red
}

# Test build
Write-Host "🔍 Running production build..." -ForegroundColor Yellow
try {
    $buildResult = npm run build 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Production build successful" -ForegroundColor Green
        $testResults += @{ Status = "SUCCESS"; Description = "Production build"; Response = "Build completed" }
    } else {
        Write-Host "❌ Production build failed" -ForegroundColor Red
        $testResults += @{ Status = "FAILED"; Description = "Production build"; Error = $buildResult }
    }
} catch {
    Write-Host "❌ Failed to run production build" -ForegroundColor Red
}

Write-Host ""
Write-Host "📊 FINAL VALIDATION REPORT" -ForegroundColor Cyan
Write-Host "===========================" -ForegroundColor Cyan

$successCount = ($testResults | Where-Object { $_.Status -eq "SUCCESS" }).Count
$totalTests = $testResults.Count

Write-Host "Total Tests: $totalTests" -ForegroundColor White
Write-Host "Successful: $successCount" -ForegroundColor Green
Write-Host "Failed: $($totalTests - $successCount)" -ForegroundColor Red

if ($successCount -eq $totalTests) {
    Write-Host ""
    Write-Host "🎯 BMad ORCHESTRATOR: NUCLEAR DEPLOYMENT SUCCESSFUL! ✅" -ForegroundColor Green
    Write-Host "========================================================" -ForegroundColor Green
    Write-Host "Your new Supabase project is fully operational!" -ForegroundColor White
    Write-Host "Next steps:" -ForegroundColor Yellow
    Write-Host "1. Update production environment variables (Netlify)" -ForegroundColor White
    Write-Host "2. Deploy to production" -ForegroundColor White
    Write-Host "3. Test live application" -ForegroundColor White
} else {
    Write-Host ""
    Write-Host "⚠️ BMad ORCHESTRATOR: ISSUES DETECTED" -ForegroundColor Yellow
    Write-Host "=====================================" -ForegroundColor Yellow
    Write-Host "Some tests failed. Check the errors above and:" -ForegroundColor White
    Write-Host "1. Verify all environment variables are correct" -ForegroundColor White
    Write-Host "2. Ensure Edge Functions are properly deployed" -ForegroundColor White
    Write-Host "3. Check Supabase project permissions" -ForegroundColor White
}

# Detailed results
Write-Host ""
Write-Host "📋 DETAILED RESULTS:" -ForegroundColor Cyan
$testResults | ForEach-Object {
    $status = if ($_.Status -eq "SUCCESS") { "✅" } else { "❌" }
    Write-Host "$status $($_.Description)" -ForegroundColor White
    if ($_.Error) {
        Write-Host "   Error: $($_.Error)" -ForegroundColor Red
    }
}