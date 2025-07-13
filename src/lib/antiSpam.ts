/**
 * Anti-spam and bot protection utilities
 */

// Common disposable email domains to block
const DISPOSABLE_EMAIL_DOMAINS = new Set([
  '10minutemail.com',
  'guerrillamail.com',
  'mailinator.com',
  'tempmail.org',
  'throwaway.email',
  'temp-mail.org',
  'yopmail.com',
  'mohmal.com',
  'sharklasers.com',
  'guerrillamail.org',
  'guerrillamail.net',
  'guerrillamail.biz',
  'guerrillamail.de',
  'grr.la',
  'guerrillamailblock.com',
  'pokemail.net',
  'spam4.me',
  'bccto.me',
  'chacuo.net',
  'dispostable.com',
  'dispoz.com',
  'fakeinbox.com',
  'filzmail.com',
  'maildrop.cc',
  'mintemail.com',
  'mytrashmail.com',
  'suremail.info',
  'tempemail.com',
  'tempmailaddress.com',
  'tempymail.com',
  'throwawaymail.com',
  'trashmail.com',
  'wegwerfmail.de',
  'wegwerfmail.net',
  'wegwerfmail.org'
]);

// Suspicious name patterns that might indicate bots
const SUSPICIOUS_NAME_PATTERNS = [
  /^test\d*$/i,
  /^user\d*$/i,
  /^admin\d*$/i,
  /^bot\d*$/i,
  /^fake\d*$/i,
  /^spam\d*$/i,
  /^temp\d*$/i,
  /^demo\d*$/i,
  /^example\d*$/i,
  /^[a-z]{1,3}\d{4,}$/i, // Short letters followed by many numbers
  /^[a-z]+\d{8,}$/i, // Letters followed by 8+ digits
];

/**
 * Validate email against disposable email services
 */
export function isDisposableEmail(email: string): boolean {
  const domain = email.toLowerCase().split('@')[1];
  if (!domain) return false;
  
  return DISPOSABLE_EMAIL_DOMAINS.has(domain);
}

/**
 * Check if name looks suspicious (bot-like)
 */
export function isSuspiciousName(name: string): boolean {
  const trimmedName = name.trim();
  
  // Too short or too long
  if (trimmedName.length < 2 || trimmedName.length > 50) {
    return true;
  }
  
  // Check against suspicious patterns
  return SUSPICIOUS_NAME_PATTERNS.some(pattern => pattern.test(trimmedName));
}

/**
 * Generate browser fingerprint for duplicate detection
 */
export function generateBrowserFingerprint(): string {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.textBaseline = 'top';
    ctx.font = '14px Arial';
    ctx.fillText('Browser fingerprint', 2, 2);
  }
  
  const fingerprint = {
    userAgent: navigator.userAgent,
    language: navigator.language,
    platform: navigator.platform,
    cookieEnabled: navigator.cookieEnabled,
    screenResolution: `${screen.width}x${screen.height}`,
    colorDepth: screen.colorDepth,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    canvas: canvas.toDataURL(),
    localStorage: !!window.localStorage,
    sessionStorage: !!window.sessionStorage,
    indexedDB: !!window.indexedDB,
    webGL: !!document.createElement('canvas').getContext('webgl')
  };
  
  // Create a simple hash
  const fpString = JSON.stringify(fingerprint);
  let hash = 0;
  for (let i = 0; i < fpString.length; i++) {
    const char = fpString.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  
  return Math.abs(hash).toString(36);
}

/**
 * Track user interaction timing for bot detection
 */
export class InteractionTracker {
  private startTime: number;
  private interactions: number = 0;
  private mouseMovements: number = 0;
  private keystrokes: number = 0;
  
  constructor() {
    this.startTime = Date.now();
    this.setupEventListeners();
  }
  
  private setupEventListeners() {
    document.addEventListener('mousemove', () => {
      this.mouseMovements++;
    }, { passive: true });
    
    document.addEventListener('keydown', () => {
      this.keystrokes++;
    }, { passive: true });
    
    document.addEventListener('click', () => {
      this.interactions++;
    }, { passive: true });
  }
  
  public getInteractionData() {
    const timeSpent = Date.now() - this.startTime;
    return {
      timeSpent,
      interactions: this.interactions,
      mouseMovements: this.mouseMovements,
      keystrokes: this.keystrokes,
      avgTimePerInteraction: this.interactions > 0 ? timeSpent / this.interactions : 0
    };
  }
  
  public isSuspiciouslyFast(): boolean {
    const { timeSpent, interactions } = this.getInteractionData();
    
    // Form filled out in less than 10 seconds is suspicious
    if (timeSpent < 10000 && interactions > 0) {
      return true;
    }
    
    // No mouse movements or keystrokes is very suspicious
    if (this.mouseMovements === 0 && this.keystrokes === 0) {
      return true;
    }
    
    return false;
  }
  
  public cleanup() {
    // Event listeners will be automatically cleaned up when the component unmounts
  }
}

/**
 * Simple math CAPTCHA generator
 */
export function generateMathCaptcha(): { question: string; answer: number } {
  const num1 = Math.floor(Math.random() * 10) + 1;
  const num2 = Math.floor(Math.random() * 10) + 1;
  const operators = ['+', '-'];
  const operator = operators[Math.floor(Math.random() * operators.length)];
  
  let answer: number;
  let question: string;
  
  if (operator === '+') {
    answer = num1 + num2;
    question = `What is ${num1} + ${num2}?`;
  } else {
    // Ensure we don't get negative numbers
    const larger = Math.max(num1, num2);
    const smaller = Math.min(num1, num2);
    answer = larger - smaller;
    question = `What is ${larger} - ${smaller}?`;
  }
  
  return { question, answer };
}

/**
 * Validate CAPTCHA answer
 */
export function validateCaptcha(userAnswer: string, correctAnswer: number): boolean {
  const parsedAnswer = parseInt(userAnswer.trim(), 10);
  return !isNaN(parsedAnswer) && parsedAnswer === correctAnswer;
}