@echo off
echo Starting safe dead code cleanup...

REM Remove the 9 confirmed unused components
echo Removing unused components...

if exist "src\components\UltraLightMobileLanding.tsx" (
    del "src\components\UltraLightMobileLanding.tsx"
    echo ✓ Removed UltraLightMobileLanding.tsx
)

if exist "src\components\VerifyEmail.tsx" (
    del "src\components\VerifyEmail.tsx"
    echo ✓ Removed VerifyEmail.tsx
)

if exist "src\components\QualificationQuizSecure.tsx" (
    del "src\components\QualificationQuizSecure.tsx"
    echo ✓ Removed QualificationQuizSecure.tsx
)

if exist "src\components\CurrencyDisplay.tsx" (
    del "src\components\CurrencyDisplay.tsx"
    echo ✓ Removed CurrencyDisplay.tsx
)

if exist "src\components\CurrencyIndicator.tsx" (
    del "src\components\CurrencyIndicator.tsx"
    echo ✓ Removed CurrencyIndicator.tsx
)

if exist "src\components\CurrencySelector.tsx" (
    del "src\components\CurrencySelector.tsx"
    echo ✓ Removed CurrencySelector.tsx
)

if exist "src\components\MobileFirstImage.tsx" (
    del "src\components\MobileFirstImage.tsx"
    echo ✓ Removed MobileFirstImage.tsx
)

if exist "src\components\MobileOptimizationProvider.tsx" (
    del "src\components\MobileOptimizationProvider.tsx"
    echo ✓ Removed MobileOptimizationProvider.tsx
)

if exist "src\components\SimpleQRCode.tsx" (
    del "src\components\SimpleQRCode.tsx"
    echo ✓ Removed SimpleQRCode.tsx
)

echo.
echo ✅ Safe cleanup completed!
echo Run 'npm run build' to verify everything still works.