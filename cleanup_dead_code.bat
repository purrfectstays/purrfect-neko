@echo off
echo Starting dead code cleanup...

REM Remove unused individual components
if exist "src\components\MobileOptimizationProvider.tsx" (
    del "src\components\MobileOptimizationProvider.tsx"
    echo Removed MobileOptimizationProvider.tsx
)

if exist "src\components\MobileOptimizedImage.tsx" (
    del "src\components\MobileOptimizedImage.tsx" 
    echo Removed MobileOptimizedImage.tsx
)

if exist "src\components\OptimizedImage.tsx" (
    del "src\components\OptimizedImage.tsx"
    echo Removed OptimizedImage.tsx
)

if exist "src\components\PerformanceOptimizedImage.tsx" (
    del "src\components\PerformanceOptimizedImage.tsx"
    echo Removed PerformanceOptimizedImage.tsx
)

if exist "src\components\QRCodeGenerator.tsx" (
    del "src\components\QRCodeGenerator.tsx"
    echo Removed QRCodeGenerator.tsx
)

if exist "src\components\RegionalUrgency.tsx" (
    del "src\components\RegionalUrgency.tsx"
    echo Removed RegionalUrgency.tsx
)

if exist "src\components\SimpleQRCode.tsx" (
    del "src\components\SimpleQRCode.tsx"
    echo Removed SimpleQRCode.tsx  
)

if exist "src\components\ValueProposition.tsx" (
    del "src\components\ValueProposition.tsx"
    echo Removed ValueProposition.tsx
)

REM Remove unused directories
if exist "src\components\landing" (
    rmdir /s /q "src\components\landing"
    echo Removed landing directory
)

if exist "src\components\template-preview" (
    rmdir /s /q "src\components\template-preview"
    echo Removed template-preview directory
)

if exist "src\components\privacy" (
    rmdir /s /q "src\components\privacy"
    echo Removed privacy directory
)

echo Dead code cleanup completed!