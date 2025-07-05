#!/bin/bash

echo "Deploying Supabase Edge Functions with CORS fixes..."
echo

echo "Step 1: Login to Supabase (this will open browser)"
npx supabase login

echo
echo "Step 2: Link to your Supabase project"
npx supabase link --project-ref wllsdbhjhzquiyfklhei

echo
echo "Step 3: Deploy send-verification-email function"
npx supabase functions deploy send-verification-email

echo
echo "Step 4: Deploy send-welcome-email function"
npx supabase functions deploy send-welcome-email

echo
echo "Deployment completed!"
echo
echo "The CORS issues should now be resolved."
echo "You can test the registration flow at http://localhost:5173"
echo