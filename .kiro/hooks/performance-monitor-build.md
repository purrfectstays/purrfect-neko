---
name: "Performance Monitor Build"
trigger: "post-build"
description: "Monitor build performance and bundle optimization after successful builds"
enabled: true
---

# Performance Monitor Build Hook

## Trigger
- **Event**: After successful build completion
- **Files**: `dist/` directory contents
- **Frequency**: Every build

## Performance Metrics

### 1. Bundle Analysis
```bash
# Analyze bundle composition
npx vite-bundle-analyzer dist/

# Check individual chunk sizes
ls -la dist/assets/ | awk '{print $5, $9}' | sort -nr

# Verify compression ratios
find dist/ -name "*.js" -exec gzip -c {} \; | wc -c
find dist/ -name "*.css" -exec gzip -c {} \; | wc -c
```

### 2. Performance Thresholds
```typescript
interface PerformanceThresholds {
  maxBundleSize: 250000;      // 250KB gzipped
  maxChunkSize: 100000;       // 100KB per chunk
  maxCssSize: 50000;          // 50KB CSS
  maxImageSize: 500000;       // 500KB per image
  buildTimeLimit: 60000;      // 60 seconds
}

const validatePerformance = (metrics: BuildMetrics) => {
  const violations: string[] = [];
  
  if (metrics.bundleSize > thresholds.maxBundleSize) {
    violations.push(`Bundle size ${metrics.bundleSize}KB exceeds ${thresholds.maxBundleSize}KB`);
  }
  
  if (metrics.buildTime > thresholds.buildTimeLimit) {
    violations.push(`Build time ${metrics.buildTime}ms exceeds ${thresholds.buildTimeLimit}ms`);
  }
  
  return violations;
};
```

### 3. Optimization Recommendations
```typescript
const generateOptimizationSuggestions = (analysis: BundleAnalysis) => {
  const suggestions: string[] = [];
  
  // Check for duplicate dependencies
  if (analysis.duplicates.length > 0) {
    suggestions.push(`Remove duplicate dependencies: ${analysis.duplicates.join(', ')}`);
  }
  
  // Check for large unused exports
  if (analysis.unusedExports.length > 0) {
    suggestions.push(`Remove unused exports to reduce bundle size`);
  }
  
  // Check for missing lazy loading
  if (analysis.heavyComponents.length > 0) {
    suggestions.push(`Consider lazy loading: ${analysis.heavyComponents.join(', ')}`);
  }
  
  return suggestions;
};
```

## Actions on Performance Issues

### 1. Automatic Optimizations
```bash
# Optimize images automatically
npx imagemin dist/assets/*.{jpg,png} --out-dir=dist/assets/optimized/

# Generate WebP versions
npx imagemin dist/assets/*.{jpg,png} --plugin=webp --out-dir=dist/assets/webp/

# Analyze and suggest code splitting opportunities
npx webpack-bundle-analyzer dist/bundle-analysis.html --mode=static
```

### 2. Issue Creation
```typescript
// Create performance issue via GitHub MCP if thresholds exceeded
const createPerformanceIssue = async (violations: string[]) => {
  if (violations.length > 0) {
    await githubMCP.createIssue({
      title: `Performance: Bundle size optimization needed`,
      body: `
## Performance Violations Found

${violations.map(v => `- ❌ ${v}`).join('\n')}

## Current Metrics
- Bundle Size: ${currentMetrics.bundleSize}KB
- Build Time: ${currentMetrics.buildTime}ms
- Chunk Count: ${currentMetrics.chunkCount}

## Optimization Suggestions
${suggestions.map(s => `- 💡 ${s}`).join('\n')}

## Target Metrics
- Bundle Size: <250KB gzipped
- Build Time: <60s
- Chunk Size: <100KB each
      `,
      labels: ['performance', 'optimization', 'build']
    });
  }
};
```

### 3. MCP Integration
```typescript
// Update Linear with performance tracking
await linearMCP.updateIssue({
  title: "Performance Monitoring",
  description: `
Build Performance Report:
- Bundle Size: ${metrics.bundleSize}KB (Target: <250KB)
- Build Time: ${metrics.buildTime}ms (Target: <60s)
- Status: ${violations.length === 0 ? '✅ PASSING' : '❌ NEEDS OPTIMIZATION'}
  `
});

// Log to Sentry for performance monitoring
await sentryMCP.trackPerformance({
  bundleSize: metrics.bundleSize,
  buildTime: metrics.buildTime,
  violations: violations.length
});
```

## Success Criteria
- ✅ Bundle size under 250KB gzipped
- ✅ Build time under 60 seconds
- ✅ No chunks over 100KB
- ✅ CSS under 50KB
- ✅ All images optimized

## Reporting
- **Performance Dashboard**: Update real-time metrics
- **Trend Analysis**: Track performance over time
- **Optimization Tracking**: Monitor improvement progress
- **Alert System**: Notify team of performance regressions

---

*This hook maintains the performance standards we established during our optimization work.*