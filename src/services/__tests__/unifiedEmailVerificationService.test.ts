import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Mock dependencies first before any imports
const { mockSupabaseClient, createMockWaitlistUser } = vi.hoisted(() => {
  const mockSupabaseClient = {
    from: vi.fn(() => ({
      insert: vi.fn(() => ({
        select: vi.fn().mockResolvedValue({ data: [], error: null }),
      })),
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          single: vi.fn().mockResolvedValue({ data: null, error: null }),
        })),
      })),
      update: vi.fn().mockResolvedValue({ data: [], error: null }),
      delete: vi.fn().mockResolvedValue({ data: [], error: null }),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockReturnThis(),
      order: vi.fn().mockReturnThis(),
    })),
  };

  const createMockWaitlistUser = (overrides = {}) => ({
    id: 'test-user-id',
    email: 'test@example.com',
    name: 'Test User',
    is_verified: true,
    quiz_completed: false,
    waitlist_position: 1,
    created_at: new Date().toISOString(),
    ...overrides,
  });

  return { mockSupabaseClient, createMockWaitlistUser };
});

vi.mock('../../lib/supabase', () => ({
  supabase: mockSupabaseClient,
  isSupabaseConfigured: vi.fn(() => true),
}));

vi.mock('../../lib/analytics', () => ({
  analytics: {
    track: vi.fn(),
  },
}));

vi.mock('../../lib/config', () => ({
  getConfig: vi.fn(() => ({
    supabase: { url: 'test-url', anonKey: 'test-key' },
    app: { url: 'http://localhost:3000' },
  })),
  isSupabaseConfigured: vi.fn(() => true),
}));

vi.mock('../geolocationService', () => ({
  GeolocationService: {
    getCurrentLocation: vi.fn().mockResolvedValue({
      country: 'United States',
      region: 'California',
      city: 'San Francisco',
    }),
  },
}));

import UnifiedEmailVerificationService from '../unifiedEmailVerificationService';

describe('UnifiedEmailVerificationService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset localStorage
    global.localStorage.clear();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('registerUser', () => {
    it('should successfully register a new user', async () => {
      const mockUser = createMockWaitlistUser({
        email: 'test@example.com',
        name: 'Test User',
        user_type: 'cat-parent',
        is_verified: true,
      });

      mockSupabaseClient.from().insert.mockResolvedValueOnce({
        data: [mockUser],
        error: null,
      });

      const result = await UnifiedEmailVerificationService.registerUser(
        'test@example.com',
        'Test User',
        'cat-parent'
      );

      expect(result.success).toBe(true);
      expect(result.user).toEqual(mockUser);
      expect(mockSupabaseClient.from).toHaveBeenCalledWith('waitlist_users');
    });

    it('should handle duplicate registration', async () => {
      mockSupabaseClient.from().insert.mockResolvedValueOnce({
        data: null,
        error: { code: '23505', message: 'duplicate key' },
      });

      const result = await UnifiedEmailVerificationService.registerUser(
        'duplicate@example.com',
        'Test User',
        'cat-parent'
      );

      expect(result.success).toBe(false);
      expect(result.error).toContain('already registered');
    });

    it('should validate email format', async () => {
      const result = await UnifiedEmailVerificationService.registerUser(
        'invalid-email',
        'Test User',
        'cat-parent'
      );

      expect(result.success).toBe(false);
      expect(result.error).toContain('valid email');
    });

    it('should validate name requirements', async () => {
      const result = await UnifiedEmailVerificationService.registerUser(
        'test@example.com',
        'a', // Too short
        'cat-parent'
      );

      expect(result.success).toBe(false);
      expect(result.error).toContain('at least 2 characters');
    });
  });

  describe('generateVerificationCode', () => {
    it('should generate a 6-digit verification code', () => {
      const code = UnifiedEmailVerificationService.generateVerificationCode();
      
      expect(code).toMatch(/^\d{6}$/);
      expect(code.length).toBe(6);
    });

    it('should generate different codes on multiple calls', () => {
      const code1 = UnifiedEmailVerificationService.generateVerificationCode();
      const code2 = UnifiedEmailVerificationService.generateVerificationCode();
      
      // Very unlikely to generate the same code twice
      expect(code1).not.toBe(code2);
    });
  });

  describe('validateVerificationCode', () => {
    beforeEach(() => {
      // Set up a verification code in localStorage
      const codeData = {
        code: '123456',
        email: 'test@example.com',
        expiresAt: Date.now() + 10 * 60 * 1000, // 10 minutes from now
        attempts: 0,
      };
      global.localStorage.setItem('verification_code', JSON.stringify(codeData));
    });

    it('should validate correct verification code', () => {
      const result = UnifiedEmailVerificationService.validateVerificationCode(
        '123456',
        'test@example.com'
      );

      expect(result.success).toBe(true);
      expect(result.isValid).toBe(true);
    });

    it('should reject incorrect verification code', () => {
      const result = UnifiedEmailVerificationService.validateVerificationCode(
        '654321',
        'test@example.com'
      );

      expect(result.success).toBe(true);
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('Invalid verification code');
    });

    it('should reject code for wrong email', () => {
      const result = UnifiedEmailVerificationService.validateVerificationCode(
        '123456',
        'wrong@example.com'
      );

      expect(result.success).toBe(true);
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('Invalid verification code');
    });

    it('should reject expired verification code', () => {
      // Set expired code
      const expiredCodeData = {
        code: '123456',
        email: 'test@example.com',
        expiresAt: Date.now() - 1000, // 1 second ago
        attempts: 0,
      };
      global.localStorage.setItem('verification_code', JSON.stringify(expiredCodeData));

      const result = UnifiedEmailVerificationService.validateVerificationCode(
        '123456',
        'test@example.com'
      );

      expect(result.success).toBe(true);
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('expired');
    });

    it('should handle rate limiting after too many attempts', () => {
      // Set code with max attempts
      const maxAttemptsCodeData = {
        code: '123456',
        email: 'test@example.com',
        expiresAt: Date.now() + 10 * 60 * 1000,
        attempts: 5, // Max attempts reached
      };
      global.localStorage.setItem('verification_code', JSON.stringify(maxAttemptsCodeData));

      const result = UnifiedEmailVerificationService.validateVerificationCode(
        '654321',
        'test@example.com'
      );

      expect(result.success).toBe(false);
      expect(result.error).toContain('Too many attempts');
    });

    it('should handle missing verification code', () => {
      global.localStorage.removeItem('verification_code');

      const result = UnifiedEmailVerificationService.validateVerificationCode(
        '123456',
        'test@example.com'
      );

      expect(result.success).toBe(true);
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('No verification code found');
    });
  });

  describe('clearVerificationCode', () => {
    it('should clear verification code from localStorage', () => {
      // Set verification code
      global.localStorage.setItem('verification_code', JSON.stringify({ test: 'data' }));
      
      UnifiedEmailVerificationService.clearVerificationCode();
      
      expect(global.localStorage.getItem('verification_code')).toBeNull();
    });
  });

  describe('getUserByEmail', () => {
    it('should retrieve user by email', async () => {
      const mockUser = createMockWaitlistUser();

      mockSupabaseClient.from().select.mockReturnValueOnce({
        eq: vi.fn().mockReturnValueOnce({
          single: vi.fn().mockResolvedValueOnce({
            data: mockUser,
            error: null,
          }),
        }),
      });

      const result = await UnifiedEmailVerificationService.getUserByEmail('test@example.com');

      expect(result.success).toBe(true);
      expect(result.user).toEqual(mockUser);
    });

    it('should handle user not found', async () => {
      mockSupabaseClient.from().select.mockReturnValueOnce({
        eq: vi.fn().mockReturnValueOnce({
          single: vi.fn().mockResolvedValueOnce({
            data: null,
            error: { code: 'PGRST116' },
          }),
        }),
      });

      const result = await UnifiedEmailVerificationService.getUserByEmail('notfound@example.com');

      expect(result.success).toBe(false);
      expect(result.error).toContain('not found');
    });
  });

  describe('input validation and security', () => {
    it('should sanitize input to prevent injection attacks', async () => {
      const maliciousEmail = "test@example.com'; DROP TABLE users; --";
      const maliciousName = "<script>alert('xss')</script>";

      const result = await UnifiedEmailVerificationService.registerUser(
        maliciousEmail,
        maliciousName,
        'cat-parent'
      );

      // Should reject malicious input
      expect(result.success).toBe(false);
    });

    it('should reject extremely long inputs', async () => {
      const longEmail = 'a'.repeat(300) + '@example.com';
      const longName = 'a'.repeat(200);

      const result = await UnifiedEmailVerificationService.registerUser(
        longEmail,
        longName,
        'cat-parent'
      );

      expect(result.success).toBe(false);
    });

    it('should validate verification code format', () => {
      global.localStorage.setItem('verification_code', JSON.stringify({
        code: '123456',
        email: 'test@example.com',
        expiresAt: Date.now() + 10 * 60 * 1000,
        attempts: 0,
      }));

      // Test various invalid formats
      const invalidCodes = ['12345', '1234567', 'abcdef', '12345a', ''];
      
      invalidCodes.forEach(invalidCode => {
        const result = UnifiedEmailVerificationService.validateVerificationCode(
          invalidCode,
          'test@example.com'
        );
        expect(result.isValid).toBe(false);
      });
    });
  });

  describe('error handling', () => {
    it('should handle database connection errors', async () => {
      mockSupabaseClient.from().insert.mockRejectedValueOnce(
        new Error('Connection failed')
      );

      const result = await UnifiedEmailVerificationService.registerUser(
        'test@example.com',
        'Test User',
        'cat-parent'
      );

      expect(result.success).toBe(false);
      expect(result.error).toContain('Connection failed');
    });

    it('should handle malformed localStorage data', () => {
      // Set invalid JSON in localStorage
      global.localStorage.setItem('verification_code', 'invalid-json');

      const result = UnifiedEmailVerificationService.validateVerificationCode(
        '123456',
        'test@example.com'
      );

      expect(result.success).toBe(true);
      expect(result.isValid).toBe(false);
    });
  });
});