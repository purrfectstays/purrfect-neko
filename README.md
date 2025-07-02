# Purrfect Stays - Cattery Booking Platform

A modern waitlist landing page for Purrfect Stays, built with React, TypeScript, Tailwind CSS, Supabase, and Resend.

## Features

- **Beautiful Landing Page**: Dark theme with indigo accents and premium design
- **Multi-step User Flow**: Registration → Email Verification → Qualification Quiz → Success
- **Supabase Backend**: User management, waitlist tracking, and real-time data
- **Automated Emails**: Verification and welcome emails via Resend
- **Responsive Design**: Optimized for all devices
- **Real-time Stats**: Live waitlist counter and user statistics

## Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Auth, Edge Functions)
- **Email**: Resend API
- **Build Tool**: Vite
- **Icons**: Lucide React

## Setup Instructions

### 1. Environment Variables

Create a `.env` file in the root directory:

```env
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Resend Configuration
RESEND_API_KEY=your_resend_api_key

# App Configuration
VITE_APP_URL=http://localhost:5173
```

### 2. Supabase Setup

1. Create a new Supabase project
2. Run the migration file: `supabase/migrations/create_waitlist_schema.sql`
3. Deploy the edge functions:
   - `supabase/functions/send-verification-email/`
   - `supabase/functions/send-welcome-email/`
4. Set environment variables in Supabase dashboard:
   - `RESEND_API_KEY`
   - `SITE_URL`

### 3. Resend Setup

1. Create a Resend account
2. Add your domain and verify DNS records
3. Get your API key from the dashboard
4. Update the "from" email addresses in the edge functions

### 4. Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Database Schema

### waitlist_users
- `id` (uuid, primary key)
- `name` (text)
- `email` (text, unique)
- `user_type` (enum: cat-parent, cattery-owner)
- `is_verified` (boolean)
- `quiz_completed` (boolean)
- `waitlist_position` (integer)
- `verification_token` (text)
- `created_at` (timestamp)
- `updated_at` (timestamp)

### quiz_responses
- `id` (uuid, primary key)
- `user_id` (uuid, foreign key)
- `question_id` (text)
- `answer` (text)
- `created_at` (timestamp)

## User Flow

1. **Landing Page**: Hero section with value propositions
2. **Registration**: Name, email, and user type selection
3. **Email Verification**: Automated email with verification link
4. **Qualification Quiz**: Personalized questions based on user type
5. **Success Page**: Waitlist position and social sharing

## Email Templates

- **Verification Email**: Welcome message with verification link
- **Welcome Email**: Confirmation with waitlist position and next steps

## Key Features

- **Row Level Security**: Secure data access patterns
- **Real-time Updates**: Live waitlist statistics
- **Responsive Design**: Mobile-first approach
- **Error Handling**: Comprehensive error states
- **Loading States**: Smooth user experience
- **Social Sharing**: Built-in referral system

## Launch Timeline

- **Q4 2025**: Beta testing begins
- **Q1 2026**: Full platform launch
- **2026**: Ongoing feature development and expansion

## Deployment

The app is ready for deployment on platforms like Vercel, Netlify, or any static hosting service. Make sure to:

1. Set environment variables in your hosting platform
2. Configure Supabase edge functions
3. Set up custom domain for Resend emails
4. Update CORS settings in Supabase

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details# Trigger fresh deployment
