# Purrfect Stays - Architecture & Structure

## Application Flow
Multi-step user journey managed by `AppContext`:
1. **Landing** → **Registration** → **Instant 6-Digit Verification** → **Qualification Quiz** → **Success**
2. State transitions controlled via `currentStep` in the context
3. Each step is a separate component with its own route when needed
4. **Verification Process**: Uses instant 6-digit code verification (no email required)

## Directory Structure
```
src/
├── components/          # React components (forms, pages, UI elements)
│   ├── guides/         # Guide-specific components
│   ├── landing/        # Landing page components
│   ├── legal/          # Legal page components
│   └── template-preview/ # Template preview components
├── context/            # React Context for global state
├── services/           # API integrations (Supabase, email, geolocation)
├── lib/               # Utilities (Supabase client, analytics, monitoring)
├── hooks/             # Custom React hooks
├── types/             # TypeScript type definitions
├── data/              # Static data (quiz questions)
└── utils/             # Utility functions

supabase/
└── migrations/        # Database schema migrations
```

## Database Schema (Supabase)
- **waitlist_users**: Main user table with verification status, quiz completion, and waitlist position
- **quiz_responses**: Stores user quiz answers linked to waitlist_users

## Key Services
- **waitlistService.ts**: User registration and waitlist management
- **unifiedEmailVerificationService.ts**: Instant verification with 6-digit codes
- **geolocationService.ts**: Location-based functionality with timeout fallbacks
- **currencyService.ts**: Exchange rate API with graceful fallbacks

## State Management
- **Global State**: `AppContext` for user flow and authentication state
- **Local State**: Component-specific state using React hooks
- **Persistent State**: localStorage for user preferences and temporary data