export const env = {
  nodeEnv: import.meta.env.MODE,
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD,
  gaMeasurementId: import.meta.env.VITE_GA_MEASUREMENT_ID,
  resendApiKey: import.meta.env.VITE_RESEND_API_KEY,
  supabaseUrl: import.meta.env.VITE_SUPABASE_URL,
  supabaseAnonKey: import.meta.env.VITE_SUPABASE_ANON_KEY,
  appUrl: import.meta.env.VITE_APP_URL || 'https://purrfectstays.vercel.app',
  siteUrl: import.meta.env.VITE_APP_URL || 'https://purrfectstays.vercel.app',
};