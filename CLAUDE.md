# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

```bash
# Install dependencies
npm install

# Start development server (runs on http://localhost:5173)
npm run dev

# Build for production
npm run build

# Lint code
npm run lint

# Preview production build
npm run preview
```

## Project Architecture

This is a **React + TypeScript + Vite** waitlist landing page for Purrfect Stays, a cattery booking platform.

### Core Architecture
- **Frontend**: React 18 with TypeScript, styled with Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Auth, Edge Functions)
- **Email Service**: Resend API for verification and welcome emails
- **State Management**: React Context API (`src/context/AppContext.tsx`)
- **Routing**: React Router with step-based navigation and lazy loading

### Key Application Flow
The app follows a multi-step user journey managed by `AppContext`:
1. **Landing** → **Registration** → **Email Verification** → **Qualification Quiz** → **Success**
2. State transitions are controlled via `currentStep` in the context
3. Each step is a separate component with its own route when needed

### Project Structure
```
src/
├── components/          # React components (forms, pages, UI elements)
├── context/            # React Context for global state
├── services/           # API integrations (Supabase, email, geolocation)
├── lib/               # Utilities (Supabase client, analytics, monitoring)
├── hooks/             # Custom React hooks
├── types/             # TypeScript type definitions
└── data/              # Static data (quiz questions)

supabase/
└── migrations/        # Database schema migrations
```

### Database Schema (Supabase)
- **waitlist_users**: Main user table with verification status, quiz completion, and waitlist position
- **quiz_responses**: Stores user quiz answers linked to waitlist_users

### Key Services
- **waitlistService.ts**: User registration and waitlist management
- **emailVerificationService.ts**: Email verification workflow
- **catteryService.ts**: Cattery-specific logic
- **githubService.ts**: GitHub integration features
- **geolocationService.ts**: Location-based functionality

### Environment Variables Required
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
RESEND_API_KEY=your_resend_api_key
VITE_APP_URL=http://localhost:5173
```

### Build Configuration
- Uses Vite with performance optimizations (chunk splitting, compression)
- Bundle analysis available at `dist/bundle-analysis.html` after build
- Lazy loading implemented for heavy components (Quiz, GitHub integration)
- Source maps enabled for production debugging

### Email System
- Verification emails sent via Supabase Edge Functions
- Welcome emails triggered after quiz completion
- Uses Resend API with custom email templates

## Working with This Codebase

- **Adding new components**: Follow existing patterns in `src/components/`
- **Database changes**: Create new migration files in `supabase/migrations/`
- **New API endpoints**: Use Supabase Edge Functions (check existing functions for patterns)
- **State management**: Extend `AppContext` for global state, use local state for component-specific data
- **Styling**: Use Tailwind CSS classes, follow the dark theme with indigo accents
- **Type safety**: Add types to `src/types/` and import as needed