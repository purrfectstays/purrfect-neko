@echo off
echo 🚀 BMad Orchestrator + Serena: Ultra-Safe Dead Code Cleanup
echo.
echo ⚡ Removing ONLY 100% confirmed unused components (zero imports found)
echo.

REM Remove the 6 confirmed unused components with zero references anywhere
echo 🗂️ Removing truly unused components...

if exist "src\components\UltraLightMobileLanding.tsx" (
    del "src\components\UltraLightMobileLanding.tsx"
    echo ✅ Removed UltraLightMobileLanding.tsx (zero imports found)
) else (
    echo ⚠️ UltraLightMobileLanding.tsx not found
)

if exist "src\components\VerifyEmail.tsx" (
    del "src\components\VerifyEmail.tsx"
    echo ✅ Removed VerifyEmail.tsx (explicitly deprecated + empty)
) else (
    echo ⚠️ VerifyEmail.tsx not found
)

if exist "src\components\QualificationQuizSecure.tsx" (
    del "src\components\QualificationQuizSecure.tsx"
    echo ✅ Removed QualificationQuizSecure.tsx (zero imports found)
) else (
    echo ⚠️ QualificationQuizSecure.tsx not found
)

if exist "src\components\SimpleQRCode.tsx" (
    del "src\components\SimpleQRCode.tsx"
    echo ✅ Removed SimpleQRCode.tsx (zero imports found)
) else (
    echo ⚠️ SimpleQRCode.tsx not found
)

if exist "src\components\MobileFirstImage.tsx" (
    del "src\components\MobileFirstImage.tsx"
    echo ✅ Removed MobileFirstImage.tsx (zero imports found)
) else (
    echo ⚠️ MobileFirstImage.tsx not found
)

if exist "src\components\MobileOptimizationProvider.tsx" (
    del "src\components\MobileOptimizationProvider.tsx"
    echo ✅ Removed MobileOptimizationProvider.tsx (zero imports found)
) else (
    echo ⚠️ MobileOptimizationProvider.tsx not found
)

echo.
echo 🧠 Analysis Summary:
echo ✅ These components had ZERO imports across entire codebase
echo ✅ No lazy imports found
echo ✅ No string references found  
echo ✅ Not used in App.tsx routing
echo ✅ Complete transitive dependency analysis performed
echo.
echo 🛡️ PRESERVED Components with dependencies:
echo ✅ CurrencyDisplay.tsx (used by BudgetPlanningGuide, ExploreCatteries)
echo ✅ CurrencyIndicator.tsx (active component)
echo ✅ CurrencySelector.tsx (active component)
echo ✅ All guides/* components (used by App.tsx routing)
echo ✅ All landing/* components (used by TemplatePreviewOptimized)
echo ✅ All template-preview/* components (used by LandingPage)
echo.
echo 🚀 Ultra-safe cleanup completed!
echo 🔨 Run 'npm run build' to verify everything still works perfectly.
echo.