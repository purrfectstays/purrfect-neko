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
- **Deployment**: Vercel (Static Site Hosting with GitHub integration)

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
VITE_APP_URL=https://your-app.vercel.app
```

## Deployment

### Vercel Deployment (Recommended)

This project is configured for seamless deployment on Vercel with GitHub integration.

#### Initial Setup:
1. **Connect GitHub Repository**:
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Vercel will auto-detect the Vite framework

2. **Configure Environment Variables** in Vercel Dashboard:
   ```bash
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   RESEND_API_KEY=your_resend_api_key
   VITE_APP_URL=https://your-app.vercel.app
   SITE_URL=https://your-app.vercel.app
   VITE_GA_MEASUREMENT_ID=your_google_analytics_id
   NODE_ENV=production
   ```

3. **Deploy**:
   - Vercel automatically deploys on every push to `main` branch
   - Preview deployments created for pull requests
   - Production deployment available at your custom domain

#### Vercel Configuration:
- `vercel.json`: Pre-configured with SPA routing, security headers, and optimization
- `package.json`: Updated with Vercel-specific build scripts
- `.vercelignore`: Excludes unnecessary files from deployment

#### Post-Deployment:
1. **Update Supabase Settings**:
   - Add Vercel domain to Supabase Auth URL allowlist
   - Update CORS settings in Edge Functions if needed

2. **Update Environment Variables**:
   - Replace localhost URLs with your Vercel domain
   - Update `SITE_URL` in Supabase Edge Functions

3. **Custom Domain** (Optional):
   - Add custom domain in Vercel dashboard
   - Update DNS records as instructed
   - Update environment variables with new domain

### Build Configuration
- Uses Vite with performance optimizations (chunk splitting, compression)
- Bundle analysis available at `dist/bundle-analysis.html` after build
- Lazy loading implemented for heavy components (Quiz, GitHub integration)
- Source maps enabled for production debugging

### Email System
- Verification emails sent via Supabase Edge Functions
- Welcome emails triggered after quiz completion
- Uses Resend API with custom email templates

## MCP (Model Context Protocol) Integration

This project now includes comprehensive MCP server configurations to enhance AI-assisted development workflows.

### Available MCP Servers

**Critical Priority MCPs:**
- **Supabase MCP**: Database operations, Edge Functions, schema management
- **GitHub MCP**: Development workflow, issue tracking, repository management  
- **Vercel MCP**: Deployment monitoring, configuration management
- **Resend MCP**: Email deliverability debugging, template management

**Secondary Priority MCPs:**
- **Google Analytics MCP**: Conversion tracking, user behavior analysis
- **Linear MCP**: Project management, feature tracking
- **Sentry MCP**: Error tracking, performance monitoring

### Setup Instructions

1. **Configuration**: See `.mcp/mcp-config.json` for server configurations
2. **Setup Guide**: Follow detailed instructions in `.mcp/setup.md`
3. **Security**: Replace placeholder tokens with actual API keys
4. **AI Tool Integration**: Import configuration into Claude Desktop, Cursor, or other compatible tools

### Benefits

With MCP integration, you can:
- Query Supabase database through natural language
- Manage GitHub issues and PRs conversationally
- Monitor Vercel deployments and debug configurations
- Analyze email deliverability and manage templates
- Track project progress and analyze user behavior

## Claude Development Rules

When working with this codebase, follow these essential rules:

1. **First think through the problem, read the codebase for relevant files, and write a plan to tasks/todo.md.**
2. **The plan should have a list of todo items that you can check off as you complete them**
3. **Before you begin working, check in with me and I will verify the plan.**
4. **Then, begin working on the todo items, marking them as complete as you go.**
5. **Please every step of the way just give me a high level explanation of what changes you made**
6. **Make every task and code change you do as simple as possible. We want to avoid making any massive or complex changes. Every change should impact as little code as possible. Everything is about simplicity.**
7. **All data and information displayed to users must be factual and accurate. Never show simulated, mock, or fake data - only real information or clearly marked placeholders.**
8. **Only use Opus 4 for planning, not for executing. Use Sonnet for all code execution and implementation tasks.**
9. **Finally, add a review section to the [todo.md](http://todo.md/) file with a summary of the changes you made and any other relevant information.**

## Working with This Codebase

- **Adding new components**: Follow existing patterns in `src/components/`
- **Database changes**: Create new migration files in `supabase/migrations/`
- **New API endpoints**: Use Supabase Edge Functions (check existing functions for patterns)
- **State management**: Extend `AppContext` for global state, use local state for component-specific data
- **Styling**: Use Tailwind CSS classes, follow the dark theme with indigo accents
- **Type safety**: Add types to `src/types/` and import as needed