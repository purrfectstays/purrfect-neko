name: "Social Sharing Component PRP"
description: |

## Purpose
Create a reusable social sharing component that allows users to share their waitlist signup success on various social media platforms, demonstrating typical React/TypeScript/Supabase patterns.

## Core Principles
1. **Reusable Component**: Can be used across different pages
2. **Type Safety**: Full TypeScript coverage
3. **Performance**: Lazy load social platform scripts
4. **Analytics**: Track sharing events
5. **Mobile Optimized**: Works on all devices

---

## Goal
Build a `SocialShareButton` component that enables users to share their Purrfect Stays waitlist signup on Twitter, Facebook, LinkedIn, and via direct link copying.

## Why
- **Viral Growth**: Encourage organic user acquisition through social sharing
- **User Engagement**: Give users a way to express excitement about joining
- **Analytics Insight**: Track which platforms drive the most referrals
- **Social Proof**: Show community growth and excitement

## What
A component with social media sharing buttons that:
- Supports Twitter, Facebook, LinkedIn, and copy link
- Tracks sharing events in analytics
- Shows sharing success feedback
- Uses appropriate share text and URLs
- Handles mobile-specific sharing (native share API)

### Success Criteria
- [ ] TypeScript compilation passes with no errors
- [ ] Component renders all sharing options
- [ ] Analytics events fire for each share action
- [ ] Mobile devices use native sharing when available
- [ ] Copy link provides user feedback
- [ ] Responsive design works on all screen sizes
- [ ] Loading states for external platform scripts

## All Needed Context

### Documentation & References
```yaml
# React Documentation
- url: https://react.dev/reference/react/useState
  sections: State management for UI feedback
  
- url: https://react.dev/reference/react/useEffect
  sections: Lazy loading social scripts

# Web APIs
- url: https://developer.mozilla.org/en-US/docs/Web/API/Navigator/share
  sections: Native mobile sharing
  
- url: https://developer.mozilla.org/en-US/docs/Web/API/Clipboard/writeText
  sections: Copy to clipboard functionality

# Social Platform URLs
- url: https://developer.twitter.com/en/docs/twitter-for-websites/tweet-button/guides/web-intent
  sections: Tweet intent URL structure
  
- url: https://developers.facebook.com/docs/sharing/reference/share-dialog
  sections: Facebook share dialog

# Internal Examples
- file: examples/components/ui-component.tsx
  why: Button component patterns and variants
  
- file: examples/hooks/use-async.ts
  why: Async operations for share actions
  
- file: src/lib/analytics.ts
  why: Event tracking patterns

# Tailwind CSS
- url: https://tailwindcss.com/docs/responsive-design
  sections: Mobile-first responsive design
```

### Current Component Tree
```
src/
├── components/
│   ├── SuccessPage.tsx         # Where this will be used
│   ├── ui/                     # Existing UI components
│   └── shared/                 # New location for SocialShare
├── lib/
│   └── analytics.ts            # Analytics integration
└── types/
    └── index.ts                # Type definitions
```

### Desired Implementation Structure
```
src/
├── components/
│   └── shared/
│       ├── SocialShare/
│       │   ├── SocialShare.tsx       # Main component
│       │   ├── ShareButton.tsx       # Individual button
│       │   └── index.ts              # Barrel export
├── hooks/
│   └── useSocialShare.ts            # Share logic hook
├── types/
│   └── socialShare.ts               # Share-related types
└── utils/
    └── shareUrls.ts                 # URL generation utilities
```

### Known Patterns & Conventions
```typescript
// Component Props Pattern
interface SocialShareProps {
  url: string;
  title: string;
  description?: string;
  hashtags?: string[];
  className?: string;
  onShare?: (platform: SharePlatform) => void;
}

// Share Platform Enum
type SharePlatform = 'twitter' | 'facebook' | 'linkedin' | 'copy';

// Analytics Event Pattern
analytics.track('social_share_clicked', {
  platform: 'twitter',
  url: shareUrl,
  source: 'success_page'
});
```

## Implementation Blueprint

### TypeScript Interfaces
```typescript
// Share-related types
export interface ShareData {
  url: string;
  title: string;
  description?: string;
  hashtags?: string[];
  image?: string;
}

export interface ShareButtonConfig {
  platform: SharePlatform;
  label: string;
  icon: string;
  color: string;
  shareUrl: (data: ShareData) => string;
}

export interface ShareResult {
  success: boolean;
  platform: SharePlatform;
  error?: string;
}
```

### Component Implementation Tasks

```yaml
Task 1: Create TypeScript interfaces
CREATE src/types/socialShare.ts:
  - Define ShareData interface
  - Define SharePlatform type
  - Define ShareButtonConfig interface
  - Export component prop types

Task 2: Create share URL utilities
CREATE src/utils/shareUrls.ts:
  - PATTERN: Pure functions for URL generation
  - Twitter intent URL builder
  - Facebook share URL builder
  - LinkedIn share URL builder
  - Proper URL encoding

Task 3: Create custom hook
CREATE src/hooks/useSocialShare.ts:
  - PATTERN: Follow examples/hooks/use-async.ts
  - Handle native share API detection
  - Manage share success/error states
  - Analytics event tracking

Task 4: Create ShareButton component
CREATE src/components/shared/SocialShare/ShareButton.tsx:
  - PATTERN: Follow examples/components/ui-component.tsx
  - Individual platform button
  - Loading and success states
  - Icon and label display

Task 5: Create main SocialShare component
CREATE src/components/shared/SocialShare/SocialShare.tsx:
  - PATTERN: Follow examples/components/stateful-component.tsx
  - Render multiple ShareButton components
  - Handle copy link functionality
  - Responsive grid layout

Task 6: Update exports
CREATE src/components/shared/SocialShare/index.ts:
  - Barrel export for clean imports
  - Export types and utilities
```

### Share URL Generation
```typescript
// URL builders for each platform
export const shareUrls = {
  twitter: (data: ShareData) => 
    `https://twitter.com/intent/tweet?text=${encodeURIComponent(data.title)}&url=${encodeURIComponent(data.url)}&hashtags=${data.hashtags?.join(',')}`,
  
  facebook: (data: ShareData) =>
    `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(data.url)}`,
  
  linkedin: (data: ShareData) =>
    `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(data.url)}&title=${encodeURIComponent(data.title)}`
};
```

### Hook Implementation Strategy
```typescript
// Custom hook for share functionality
export const useSocialShare = () => {
  const [isSharing, setIsSharing] = useState(false);
  const [shareResult, setShareResult] = useState<ShareResult | null>(null);

  const share = async (platform: SharePlatform, data: ShareData) => {
    setIsSharing(true);
    
    try {
      if (platform === 'copy') {
        await navigator.clipboard.writeText(data.url);
        analytics.track('social_share_completed', { platform, success: true });
        setShareResult({ success: true, platform });
      } else {
        // Open share URL in new window
        const shareUrl = shareUrls[platform](data);
        window.open(shareUrl, '_blank', 'width=600,height=400');
        analytics.track('social_share_clicked', { platform, url: data.url });
      }
    } catch (error) {
      setShareResult({ success: false, platform, error: error.message });
    } finally {
      setIsSharing(false);
    }
  };

  return { share, isSharing, shareResult };
};
```

## Validation Loop

### Level 1: TypeScript & Linting
```bash
# Must pass with zero errors
npm run typecheck
npm run lint

# Common issues to check:
# - SharePlatform type used consistently
# - No any types in share functions
# - Proper event handler typing
```

### Level 2: Build Validation
```bash
# Must build successfully
npm run build

# Check for:
# - No import errors
# - Tree shaking works properly
# - Icons load correctly
```

### Level 3: Component Testing Checklist
```typescript
// Manual testing scenarios
- [ ] Twitter share opens correct URL
- [ ] Facebook share opens correct URL  
- [ ] LinkedIn share opens correct URL
- [ ] Copy link works and shows feedback
- [ ] Mobile native share works (if supported)
- [ ] Analytics events fire correctly
- [ ] Loading states display properly
- [ ] Error states handle gracefully
- [ ] Responsive layout works
- [ ] Icons display correctly
```

### Level 4: Integration Testing
```bash
# Start dev server
npm run dev

# Test integration with SuccessPage:
1. Complete waitlist registration flow
2. Reach success page
3. Test each share button
4. Verify analytics in browser devtools
5. Test on mobile device
```

## Final Validation Checklist
- [ ] TypeScript: `npm run typecheck` passes
- [ ] Linting: `npm run lint` passes  
- [ ] Build: `npm run build` succeeds
- [ ] All share platforms work correctly
- [ ] Copy link provides user feedback
- [ ] Analytics events tracked properly
- [ ] Mobile responsive design
- [ ] Native share API used when available
- [ ] Error handling for clipboard/network failures
- [ ] Accessibility: keyboard navigation works
- [ ] Performance: no unnecessary re-renders
- [ ] Icons load from CDN or local assets

---

## Performance Considerations
- Lazy load social platform tracking scripts
- Use React.memo for ShareButton components
- Debounce rapid share clicks
- Optimize icon loading (SVG or icon font)
- Cache share URLs to avoid recalculation

## Accessibility Requirements
- ARIA labels for each share button
- Keyboard navigation support
- Screen reader announcements for share success
- High contrast icons for visibility
- Focus management for modal-like sharing

## Analytics Events
```typescript
// Track share button clicks
analytics.track('social_share_clicked', {
  platform: 'twitter',
  url: shareUrl,
  source: 'success_page',
  user_type: user?.userType
});

// Track successful shares (for copy link)
analytics.track('social_share_completed', {
  platform: 'copy',
  success: true,
  timestamp: new Date().toISOString()
});
```

This PRP provides comprehensive context for implementing a production-ready social sharing component following all Purrfect Stays patterns and conventions.