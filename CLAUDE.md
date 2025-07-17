# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Startup Behavior

When starting a new Claude Code session in this project, offer the following options:

1. **Standard Mode** - Regular Claude Code assistance
2. **BMad-Method Mode** - Activate specialized agent framework

To activate BMad-Method, users can:
- Type `*help` to see all available agents and workflows
- Type `*agent bmad-orchestrator` to start with the orchestrator
- Type `*workflow-guidance` for help selecting the right workflow

The BMad-Method framework provides specialized agents (Analyst, PM, Architect, UX Expert, etc.) and structured workflows for development tasks. 

**Important**: The complete BMad-Method framework is stored in `/team-fullstack.txt` (417KB). This file contains all agent definitions, workflows, tasks, and knowledge base. Claude will load specific sections as needed rather than the entire file at once.

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
1. **Landing** → **Registration** → **Instant 6-Digit Verification** → **Qualification Quiz** → **Success**
2. State transitions are controlled via `currentStep` in the context
3. Each step is a separate component with its own route when needed
4. **Verification Process**: Uses instant 6-digit code verification (no email required)
5. **Security**: All verification happens on-the-spot with rate limiting and anti-spam measures

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
- **unifiedEmailVerificationService.ts**: Instant verification with 6-digit codes (no email sending)
- **emailVerificationService.ts**: Legacy email verification (deprecated)
- **catteryService.ts**: Cattery-specific logic
- **githubService.ts**: GitHub integration features
- **geolocationService.ts**: Location-based functionality with timeout fallbacks
- **currencyService.ts**: Exchange rate API with graceful fallbacks

### Environment Variables Required
```env
# Frontend (VITE_ prefix exposes to browser)
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_APP_URL=https://your-app.netlify.app
VITE_GA_MEASUREMENT_ID=your_google_analytics_id

# Backend Only (NO VITE_ prefix - server-side only)
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
RESEND_API_KEY=your_resend_api_key
```

⚠️ **CRITICAL SECURITY**: Never use `VITE_` prefix for sensitive keys (service role, API keys) as this exposes them to the browser!

## Deployment

### Netlify Deployment (Recommended)

This project is configured for seamless deployment on Netlify with GitHub integration.

#### Initial Setup:
1. **Connect GitHub Repository**:
   - Go to [app.netlify.com](https://app.netlify.com)
   - Import your GitHub repository
   - Netlify will auto-detect the Vite framework

2. **Configure Environment Variables** in Netlify Dashboard:
   ```bash
   # Frontend Variables (safe to expose)
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   VITE_APP_URL=https://purrfectstays.org
   VITE_GA_MEASUREMENT_ID=your_google_analytics_id
   NODE_ENV=production
   
   # Backend Variables (NEVER use VITE_ prefix)
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   RESEND_API_KEY=your_resend_api_key
   ```
   
   ⚠️ **CRITICAL**: Backend variables without `VITE_` prefix are server-only and secure.

3. **Deploy**:
   - Netlify automatically deploys on every push to `main` branch
   - Preview deployments created for pull requests
   - Production deployment available at your custom domain

#### Netlify Configuration:
- `netlify.toml`: Pre-configured with SPA routing, security headers, and optimization
- **Security Headers**: CSP, XSS protection, frame options, CORS policy
- **API Whitelisting**: Exchange Rate API, geolocation APIs, Google Analytics
- Build command: `npm run build`
- Publish directory: `dist`
- Node version: 18
- **Recent Updates**: Added Exchange Rate API to CSP connect-src for currency features

#### Post-Deployment:
1. **Update Supabase Settings**:
   - Add Netlify domain to Supabase Auth URL allowlist
   - Update CORS settings in Edge Functions (use specific origins, not wildcard)
   - Set `SITE_URL` in Edge Functions to your Netlify URL
   - Verify RLS policies are properly configured

2. **Security Verification**:
   - Confirm no VITE_ prefixed sensitive keys in browser
   - Test CORS policies work with your domain
   - Verify CSP headers are not blocking legitimate requests
   - Check all external API calls work (geolocation, currency, analytics)

3. **Environment Variables**:
   - Replace localhost URLs with your Netlify domain
   - Ensure all API keys are properly set in Netlify dashboard
   - Test Edge Functions have access to server-side environment variables

4. **Custom Domain** (Optional):
   - Add custom domain in Netlify dashboard
   - Update DNS records as instructed
   - Update all environment variables with new domain
   - Update Supabase allowed origins list

### Build Configuration
- Uses Vite with performance optimizations (chunk splitting, compression)
- Bundle analysis available at `dist/bundle-analysis.html` after build
- Lazy loading implemented for heavy components (Quiz, GitHub integration)
- Source maps enabled for production debugging

### Authentication & Email System
- **Verification**: Instant 6-digit code verification (no email sending required)
- **Welcome emails**: Triggered after quiz completion via Supabase Edge Functions
- **Email API**: Uses Resend API with custom email templates
- **Security**: Rate limiting, CAPTCHA, honeypot fields, and anti-spam measures
- **Fallbacks**: Graceful degradation when external APIs fail

## MCP (Model Context Protocol) Integration

This project includes a production-ready MCP setup with comprehensive deployment workflows for streamlined development.

### Available MCP Servers

**Critical Priority MCPs:**
- **Supabase MCP**: Database operations, Edge Functions deployment, schema management
- **GitHub MCP**: Development workflow, issue tracking, repository management  
- **Netlify MCP**: Frontend deployment monitoring, build management, configuration
- **Resend MCP**: Email deliverability debugging, template management

**Secondary Priority MCPs:**
- **Google Analytics MCP**: Conversion tracking, user behavior analysis
- **Linear MCP**: Project management, feature tracking
- **Sentry MCP**: Error tracking, performance monitoring

### Setup Instructions

1. **Quick Start**: Follow `.mcp/quick-start.md` for 15-minute setup
2. **Full Configuration**: See `.mcp/mcp-config.json` for complete server configurations
3. **Deployment Plan**: Review `.mcp/deployment-plan.md` for comprehensive deployment strategy
4. **Setup Guide**: Detailed instructions in `.mcp/setup.md`
5. **Security**: Replace placeholder tokens with actual API keys
6. **AI Tool Integration**: Import configuration into Claude Desktop, Cursor, or other compatible tools

### Benefits

With MCP integration, you can:
- Deploy Edge Functions via natural language commands
- Query Supabase database conversationally
- Manage GitHub issues and PRs through AI
- Monitor Netlify deployments and build status
- Debug email deliverability and manage templates
- Track project progress and analyze user behavior

### Deployment Workflow

The MCP setup enables streamlined deployments:
- **Function Deployment**: `"Deploy send-verification-email function to Supabase"`
- **Status Monitoring**: `"Show deployment status and logs"`
- **Testing**: `"Test email function with sample data"`
- **Rollback**: `"Rollback function to previous version"`

## Claude Development Rules

When working with this codebase, follow these essential rules:

### 📋 Task Management & Planning
1. **First think through the problem, read the codebase for relevant files, and use TodoWrite tool to create a plan.**
2. **The plan should have a list of todo items that you can check off as you complete them**
3. **Before you begin working, check in with me and I will verify the plan.**
4. **Then, begin working on the todo items, marking them as completed in real-time as you go.**
5. **Use TodoWrite tool frequently to track progress and keep user informed**

### 🔍 Code Quality & Simplicity
6. **Make every task and code change as simple as possible. Avoid massive or complex changes. Every change should impact as little code as possible. Everything is about simplicity.**
7. **Please every step of the way just give me a high level explanation of what changes you made**
8. **All data and information displayed to users must be factual and accurate. Never show simulated, mock, or fake data - only real information or clearly marked placeholders.**

### 🔒 Security-First Development
9. **Always run security checks before deployment: verify no exposed secrets, test CSP headers, validate CORS settings**
10. **Never expose sensitive keys with VITE_ prefix - use server-side environment variables**
11. **Test all external API integrations after CSP/CORS changes**

### 📈 User Communication
12. **ALWAYS provide detailed step-by-step instructions for non-technical users. Since the user has zero coding experience, include:**
    - Exact button names and locations
    - What screens should look like
    - Where to click, what to type (exactly)
    - Expected results after each step
    - Simple explanations of what's happening
    - Screenshots descriptions when helpful
    - Common mistakes to avoid
    - What to do if something goes wrong
13. **Let me know when you have a better suggestion or idea so we can lockhorns**

### 🚀 Recent Best Practices Learned
- **Use Task tool for complex research** rather than multiple grep/search operations
- **Batch tool calls** when possible for better performance
- **Always verify build success** after security or API changes
- **Update CLAUDE.md** after significant architectural changes

## Working with This Codebase

- **Adding new components**: Follow existing patterns in `src/components/`
- **Database changes**: Create new migration files in `supabase/migrations/`
- **New API endpoints**: Use Supabase Edge Functions (check existing functions for patterns)
- **State management**: Extend `AppContext` for global state, use local state for component-specific data
- **Styling**: Use Tailwind CSS classes, follow the dark theme with indigo accents
- **Type safety**: Add types to `src/types/` and import as needed

## Context Engineering Integration

This project uses Context Engineering principles to ensure high-quality, consistent AI-assisted development.

### 🔄 Project Awareness & Context

- **Always check `examples/` directory** for patterns before implementing new features
- **Read relevant PRPs** in `PRPs/` for detailed implementation blueprints
- **Use TodoWrite tool** to plan complex features before implementation
- **Follow existing patterns** rather than introducing new ones

### 🧱 Code Structure & Modularity

#### React Component Guidelines
- **Component files < 300 lines**. Split into smaller components if larger
- **One component per file** with clear, descriptive names
- **Organize by feature** in subdirectories (e.g., `components/waitlist/`, `components/quiz/`)
- **Use TypeScript interfaces** for all props and state
- **Export types separately** from `src/types/` for reusability

#### Service Layer Rules
- **Services handle all external API calls** (Supabase, Resend, etc.)
- **Return typed responses** with proper error handling
- **Use async/await** consistently, never mix with .then()
- **Implement retry logic** for critical operations
- **Log errors** but don't expose sensitive data

### 🧪 Testing & Reliability

- **Write tests for new features** using Vitest patterns
- **Test file structure**: `__tests__/` folders next to components
- **Include tests for**:
  - Happy path (expected behavior)
  - Error states (API failures, validation errors)
  - Edge cases (empty data, boundary conditions)
  - Loading states
- **Mock external services** (Supabase, Resend) in tests
- **Maintain > 80% coverage** for new code

### ✅ Validation Commands

Before committing any changes, run:
```bash
# TypeScript type checking
npm run typecheck

# ESLint for code quality
npm run lint

# Build to ensure no compilation errors
npm run build

# Run tests (when implemented)
npm run test
```

### 📎 Style & Conventions

#### TypeScript Conventions
- **Strict mode enabled** - no `any` types unless absolutely necessary
- **Use type inference** where possible, explicit types where helpful
- **Prefer interfaces over types** for object shapes
- **Use enums** for fixed sets of values
- **Generic types** for reusable components/hooks

#### React Patterns
- **Functional components only** - no class components
- **Custom hooks** for reusable logic (prefix with `use`)
- **Memoization** for expensive computations (React.memo, useMemo)
- **Error boundaries** for graceful error handling
- **Suspense boundaries** for code splitting

#### Tailwind CSS Guidelines
- **Mobile-first responsive design** (use sm:, md:, lg: prefixes)
- **Dark theme by default** with indigo accent colors
- **Consistent spacing** using Tailwind's spacing scale
- **No custom CSS** unless absolutely necessary
- **Component variants** using cn() utility for conditional classes

### 📚 Documentation & Examples

- **Update examples/** when adding new patterns
- **Document complex logic** with inline comments
- **JSDoc comments** for exported functions and components
- **Update CLAUDE.md** immediately after significant changes
- **Keep security documentation current** with latest fixes and best practices
- **Document API integrations** including CSP requirements and fallback strategies

### 🧠 AI Behavior Rules

- **Never assume context** - read existing code first
- **Follow established patterns** from examples/
- **Validate against TypeScript** before considering task complete
- **Check for existing utilities** before creating new ones
- **Respect file organization** - don't create files in wrong directories

### 🔐 Security Guidelines

#### Critical Security Rules (MUST FOLLOW)
- **Never commit sensitive data** (API keys, secrets) - Use .env.example for templates
- **Environment Variable Security**: Never use `VITE_` prefix for sensitive keys (exposes to browser)
- **Service Role Key**: Only use server-side in Edge Functions, never in frontend code
- **CORS Configuration**: Use specific allowed origins, never wildcard `*`
- **CSP Headers**: Maintain strict Content Security Policy in netlify.toml
- **API Key Rotation**: Regularly rotate all API keys and tokens
- **Deployment Security**: Always check browser devtools to ensure no secrets are exposed

#### Authentication & Authorization
- **Verification System**: Uses instant 6-digit codes (no email verification required)
- **Rate Limiting**: Client-side with fingerprinting + server-side enforcement
- **Input Validation**: Comprehensive validation on both client and server
- **RLS Policies**: Proper Row Level Security in Supabase
- **Anti-Spam**: CAPTCHA, honeypot fields, disposable email detection

#### API Security
- **External APIs**: All APIs whitelisted in CSP connect-src
- **Timeout Handling**: 5-second timeouts with graceful fallbacks
- **Error Handling**: No sensitive information leaked in error messages
- **Retry Logic**: Implemented for critical operations

#### Recent Security Audit Results
- ✅ **FIXED**: Removed Resend API key from frontend environment
- ✅ **FIXED**: Added Exchange Rate API to CSP connect-src whitelist  
- ✅ **FIXED**: Removed CORS wildcard configuration in Edge Functions
- ✅ **FIXED**: Implemented timeout fallbacks for external API calls
- ✅ **FIXED**: Added graceful degradation for geolocation services
- ✅ **FIXED**: Removed undefined environment variable references
- ⚠️ **ONGOING**: Regular security audits and penetration testing

#### Security Checklist for Deployments
1. ☐ Verify no `VITE_` prefixed sensitive keys
2. ☐ Check CSP headers allow required APIs
3. ☐ Test CORS policies with production domain
4. ☐ Confirm Edge Functions have proper environment variables
5. ☐ Verify RLS policies restrict data access appropriately
6. ☐ Test rate limiting and anti-spam measures
7. ☐ Check browser devtools for exposed secrets

### 🚀 Performance Considerations

- **Lazy load heavy components** (already implemented for Quiz, GitHub integration)
- **Optimize images** with proper sizing and formats
- **Minimize bundle size** - check before adding dependencies (current: ~850KB vendor chunk)
- **Use React.memo** for expensive re-renders
- **Implement proper loading states** for better UX
- **API Timeouts**: 5-second timeouts prevent hanging on slow external APIs
- **Graceful Degradation**: Fallbacks when external services fail
- **Bundle Analysis**: Available at `dist/bundle-analysis.html` after build
- **Compression**: Gzip and Brotli compression enabled in Netlify

## BMad-Method Integration

This project integrates the BMad-Method framework for enhanced development workflows and specialized AI assistance.

### 🎭 BMad-Method Overview

The BMad-Method is a comprehensive agent-based framework that transforms Claude into specialized roles:
- **BMad Orchestrator**: Master coordinator for workflow management
- **Analyst**: Requirements analysis and system understanding
- **PM (Project Manager)**: Project planning and coordination
- **UX Expert**: User experience and interface design
- **Architect**: System architecture and technical design
- **PO (Product Owner)**: Product vision and backlog management

### 🚀 Quick Start Commands

All BMad commands start with `*` (asterisk):

**Core Commands:**
- `*help` - Show available agents and workflows
- `*status` - Show current context and active agent
- `*agent [name]` - Transform into specialized agent
- `*exit` - Return to normal Claude mode

**Workflow Commands:**
- `*workflow [name]` - Start specific workflow
- `*workflow-guidance` - Get help selecting the right workflow
- `*plan` - Create detailed workflow plan
- `*plan-status` - Show workflow progress

**Available Workflows:**
- `brownfield-fullstack` - Enhance existing full-stack apps
- `brownfield-ui` - Improve existing UI/frontend
- `brownfield-service` - Upgrade existing services
- `greenfield-fullstack` - Build new full-stack apps
- `greenfield-ui` - Create new UI/frontend
- `greenfield-service` - Develop new services

### 📋 Usage Examples

1. **Start a new feature:**
   ```
   *agent analyst
   *task requirements-analysis
   ```

2. **Plan architectural changes:**
   ```
   *agent architect
   *workflow brownfield-fullstack
   ```

3. **Get workflow guidance:**
   ```
   *workflow-guidance
   [Answer questions about your project]
   ```

### 🎯 When to Use BMad-Method

Use BMad-Method when you need:
- Structured approach to complex features
- Multiple perspectives (UX, architecture, PM)
- Workflow-driven development
- Comprehensive documentation
- Team-like collaboration from AI

### 📁 BMad Resources

The full BMad-Method framework is stored in `team-fullstack.txt`. This file contains:
- Complete agent definitions
- All workflow templates
- Task libraries
- Checklist templates
- Utils and knowledge base

**Note**: BMad agents load resources only when needed - never pre-load entire framework.

### 🔄 Auto-Activation (Optional)

To automatically start in BMad mode, begin conversations with:
```
*agent bmad-orchestrator
*help
```

This provides immediate access to all BMad capabilities.

## PRP (Product Requirements Prompt) Workflow

### When to Use PRPs

Use PRPs for:
- Features requiring 3+ files or components
- Complex integrations (new APIs, services)
- Multi-step user flows
- Database schema changes
- Major refactoring

### How to Generate PRPs

1. Create an INITIAL.md file describing your feature
2. Run: `/generate-prp INITIAL.md`
3. Review the generated PRP in `PRPs/`
4. Execute with: `/execute-prp PRPs/your-feature.md`

### PRP Success Criteria

Every PRP must include:
- Clear goal and success metrics
- All necessary documentation links
- Code examples from this project
- Validation commands that must pass (lint, build, typecheck)
- Error handling requirements
- Security considerations and CSP/CORS impact
- Environment variable requirements (with proper VITE_/non-VITE_ prefixes)
- Testing strategy for external API integrations

## Launch Readiness Status

### ✅ **PRODUCTION READY**
- **Security**: Comprehensive audit completed, critical issues fixed
- **Performance**: Optimized bundle size, lazy loading, compression enabled
- **CSP/CORS**: Properly configured for all external APIs
- **Environment**: Secure variable handling, no exposed secrets
- **Authentication**: Instant 6-digit verification with anti-spam measures
- **Error Handling**: Graceful degradation for all external services
- **Monitoring**: Analytics, error tracking, and performance monitoring

### 🗺️ **Recent Security Fixes (2025-01-16)**
- Fixed exposed API keys in environment variables
- Updated CSP to whitelist Exchange Rate API
- Implemented API timeout fallbacks
- Removed CORS wildcard configurations
- Added graceful degradation for geolocation services

### 🚀 **Ready for Public Launch**
The application has passed comprehensive security auditing and is ready for production deployment with proper environment variable configuration.