// Check if the logo-email.png file is accessible from the expected URL
import fetch from 'node-fetch';

async function checkLogoURL() {
  const logoUrl = 'https://purrfect-landingpage.netlify.app/logo-email.png';
  
  console.log('🔍 Checking logo URL accessibility...');
  console.log('📍 URL:', logoUrl);
  
  try {
    const response = await fetch(logoUrl);
    
    console.log('📊 Response status:', response.status);
    console.log('📊 Response status text:', response.statusText);
    console.log('📊 Content-Type:', response.headers.get('content-type'));
    console.log('📊 Content-Length:', response.headers.get('content-length'));
    
    if (response.ok) {
      console.log('✅ Logo URL is accessible');
      console.log('🖼️ Logo file exists and can be loaded');
    } else {
      console.log('❌ Logo URL is NOT accessible');
      console.log('🚨 This could be why the email logo is not working');
    }
  } catch (error) {
    console.error('❌ Error checking logo URL:', error.message);
    console.log('🚨 This could be why the email logo is not working');
  }
}

// Run the check
checkLogoURL();