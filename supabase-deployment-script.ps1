# Purrfect Stays - Complete Supabase Project Deployment Script
# BMad Orchestrator - Nuclear Option Deployment

Write-Host "🎯 BMAD ORCHESTRATOR - SUPABASE NUCLEAR DEPLOYMENT" -ForegroundColor Cyan
Write-Host "===============================================" -ForegroundColor Cyan

# Check if Supabase CLI is installed
Write-Host "📋 Checking Supabase CLI installation..." -ForegroundColor Yellow
try {
    $supabaseVersion = supabase --version
    Write-Host "✅ Supabase CLI found: $supabaseVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Supabase CLI not found. Installing..." -ForegroundColor Red
    npm install -g supabase
    Write-Host "✅ Supabase CLI installed!" -ForegroundColor Green
}

# Prompt for new project details
Write-Host ""
Write-Host "🚀 NEW PROJECT CONFIGURATION" -ForegroundColor Cyan
Write-Host "==============================" -ForegroundColor Cyan

$projectRef = Read-Host "Enter your new Supabase project reference ID (from project URL)"
$projectUrl = "https://$projectRef.supabase.co"

Write-Host ""
Write-Host "🔐 AUTHENTICATION SETUP" -ForegroundColor Cyan
Write-Host "========================" -ForegroundColor Cyan

# Login to Supabase CLI
Write-Host "🔑 Logging into Supabase CLI..." -ForegroundColor Yellow
supabase login

# Link to new project
Write-Host "🔗 Linking to new project: $projectRef" -ForegroundColor Yellow
supabase link --project-ref $projectRef

Write-Host ""
Write-Host "🗄️ DATABASE MIGRATION" -ForegroundColor Cyan
Write-Host "=====================" -ForegroundColor Cyan

# Apply database migrations
Write-Host "📊 Applying all database migrations..." -ForegroundColor Yellow
try {
    supabase db push
    Write-Host "✅ Database schema deployed successfully!" -ForegroundColor Green
} catch {
    Write-Host "❌ Database migration failed. Check your project permissions." -ForegroundColor Red
    Write-Host "Manual fix: Go to Supabase Dashboard → SQL Editor and run migrations manually" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "⚡ EDGE FUNCTIONS DEPLOYMENT" -ForegroundColor Cyan
Write-Host "=============================" -ForegroundColor Cyan

# Deploy Edge Functions
$functions = @(
    "send-welcome-email",
    "send-verification-email",
    "auto-send-welcome-emails"
)

foreach ($func in $functions) {
    Write-Host "🚀 Deploying function: $func" -ForegroundColor Yellow
    try {
        supabase functions deploy $func
        Write-Host "✅ $func deployed successfully!" -ForegroundColor Green
    } catch {
        Write-Host "❌ Failed to deploy $func" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "🎯 DEPLOYMENT COMPLETE!" -ForegroundColor Green
Write-Host "======================" -ForegroundColor Green
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Update Edge Function environment variables in Supabase Dashboard" -ForegroundColor White
Write-Host "2. Update your local .env file with new project credentials" -ForegroundColor White
Write-Host "3. Update production environment variables (Netlify)" -ForegroundColor White
Write-Host "4. Test the application locally" -ForegroundColor White
Write-Host ""
Write-Host "New project URL: $projectUrl" -ForegroundColor Cyan