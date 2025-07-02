// Navigation utilities for consistent page transitions

export const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

export const navigateWithScrollReset = (callback: () => void) => {
  callback();
  setTimeout(() => scrollToTop(), 100);
};

export const navigateToLandingPage = () => {
  window.location.href = '/landingpage';
};

export const navigateToMainSite = () => {
  window.location.href = '/';
};

export const navigateToSupport = () => {
  window.location.href = '/support';
};

export const navigateToPrivacy = () => {
  window.location.href = '/privacy';
};

export const navigateToTerms = () => {
  window.location.href = '/terms';
};

export const navigateToCookies = () => {
  window.location.href = '/cookies';
};

export const navigateToQRCode = () => {
  window.location.href = '/qr';
};