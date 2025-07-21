import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { WaitlistService } from '../waitlistService';
import { mockSupabaseClient, createMockWaitlistUser } from '../../test/utils';

// Mock the supabase client
vi.mock('../../lib/supabase', () => ({
  supabase: mockSupabaseClient,
  isSupabaseConfigured: vi.fn(() => true),
}));

// Mock geolocation service
vi.mock('../geolocationService', () => ({
  GeolocationService: {
    getCurrentLocation: vi.fn().mockResolvedValue({
      country: 'United States',
      region: 'California',
      city: 'San Francisco',
      country_code: 'US',
      latitude: 37.7749,
      longitude: -122.4194,
      timezone: 'America/Los_Angeles',
    }),
  },
}));

describe('WaitlistService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('addToWaitlist', () => {
    it('should successfully add a user to the waitlist', async () => {
      const mockUser = createMockWaitlistUser({
        email: 'test@example.com',
        name: 'Test User',
        user_type: 'cat-parent',
      });

      mockSupabaseClient.from().insert.mockResolvedValueOnce({
        data: [mockUser],
        error: null,
      });

      const result = await WaitlistService.addToWaitlist(
        'test@example.com',
        'Test User',
        'cat-parent'
      );

      expect(result.success).toBe(true);
      expect(result.user).toEqual(mockUser);
      expect(mockSupabaseClient.from).toHaveBeenCalledWith('waitlist_users');
      expect(mockSupabaseClient.from().insert).toHaveBeenCalled();
    });

    it('should handle duplicate email error', async () => {
      mockSupabaseClient.from().insert.mockResolvedValueOnce({
        data: null,
        error: { code: '23505', message: 'duplicate key value' },
      });

      const result = await WaitlistService.addToWaitlist(
        'duplicate@example.com',
        'Test User',
        'cat-parent'
      );

      expect(result.success).toBe(false);
      expect(result.error).toContain('already registered');
    });

    it('should validate email format', async () => {
      const result = await WaitlistService.addToWaitlist(
        'invalid-email',
        'Test User',
        'cat-parent'
      );

      expect(result.success).toBe(false);
      expect(result.error).toContain('valid email');
    });

    it('should validate name length', async () => {
      const result = await WaitlistService.addToWaitlist(
        'test@example.com',
        'a', // Too short
        'cat-parent'
      );

      expect(result.success).toBe(false);
      expect(result.error).toContain('least 2 characters');
    });

    it('should include location data when available', async () => {
      const mockUser = createMockWaitlistUser({
        country: 'United States',
        region: 'California',
        city: 'San Francisco',
      });

      mockSupabaseClient.from().insert.mockResolvedValueOnce({
        data: [mockUser],
        error: null,
      });

      const result = await WaitlistService.addToWaitlist(
        'test@example.com',
        'Test User',
        'cat-parent'
      );

      expect(result.success).toBe(true);
      expect(result.user?.country).toBe('United States');
      expect(result.user?.region).toBe('California');
      expect(result.user?.city).toBe('San Francisco');
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

      const result = await WaitlistService.getUserByEmail('test@example.com');

      expect(result.success).toBe(true);
      expect(result.user).toEqual(mockUser);
      expect(mockSupabaseClient.from).toHaveBeenCalledWith('waitlist_users');
    });

    it('should handle user not found', async () => {
      mockSupabaseClient.from().select.mockReturnValueOnce({
        eq: vi.fn().mockReturnValueOnce({
          single: vi.fn().mockResolvedValueOnce({
            data: null,
            error: { code: 'PGRST116', message: 'No rows found' },
          }),
        }),
      });

      const result = await WaitlistService.getUserByEmail('notfound@example.com');

      expect(result.success).toBe(false);
      expect(result.error).toContain('not found');
    });

    it('should validate email format', async () => {
      const result = await WaitlistService.getUserByEmail('invalid-email');

      expect(result.success).toBe(false);
      expect(result.error).toContain('valid email');
    });
  });

  describe('updateUserPosition', () => {
    it('should update user waitlist position', async () => {
      const mockUser = createMockWaitlistUser({ waitlist_position: 5 });

      mockSupabaseClient.from().update.mockReturnValueOnce({
        eq: vi.fn().mockReturnValueOnce({
          select: vi.fn().mockReturnValueOnce({
            single: vi.fn().mockResolvedValueOnce({
              data: mockUser,
              error: null,
            }),
          }),
        }),
      });

      const result = await WaitlistService.updateUserPosition('test-user-id', 5);

      expect(result.success).toBe(true);
      expect(result.user?.waitlist_position).toBe(5);
    });

    it('should handle update errors', async () => {
      mockSupabaseClient.from().update.mockReturnValueOnce({
        eq: vi.fn().mockReturnValueOnce({
          select: vi.fn().mockReturnValueOnce({
            single: vi.fn().mockResolvedValueOnce({
              data: null,
              error: { message: 'Update failed' },
            }),
          }),
        }),
      });

      const result = await WaitlistService.updateUserPosition('test-user-id', 5);

      expect(result.success).toBe(false);
      expect(result.error).toContain('Update failed');
    });
  });

  describe('getWaitlistStats', () => {
    it('should return waitlist statistics', async () => {
      const mockStats = [
        { count: 150, user_type: 'cat-parent' },
        { count: 45, user_type: 'cattery-owner' },
      ];

      mockSupabaseClient.from().select.mockResolvedValueOnce({
        data: mockStats,
        error: null,
      });

      const result = await WaitlistService.getWaitlistStats();

      expect(result.success).toBe(true);
      expect(result.stats?.totalUsers).toBe(195);
      expect(result.stats?.catParents).toBe(150);
      expect(result.stats?.catteryOwners).toBe(45);
    });

    it('should handle stats query errors', async () => {
      mockSupabaseClient.from().select.mockResolvedValueOnce({
        data: null,
        error: { message: 'Stats query failed' },
      });

      const result = await WaitlistService.getWaitlistStats();

      expect(result.success).toBe(false);
      expect(result.error).toContain('Stats query failed');
    });
  });

  describe('input validation', () => {
    it('should reject emails that are too long', async () => {
      const longEmail = 'a'.repeat(300) + '@example.com';
      
      const result = await WaitlistService.addToWaitlist(
        longEmail,
        'Test User',
        'cat-parent'
      );

      expect(result.success).toBe(false);
      expect(result.error).toContain('valid email');
    });

    it('should reject names that are too long', async () => {
      const longName = 'a'.repeat(101);
      
      const result = await WaitlistService.addToWaitlist(
        'test@example.com',
        longName,
        'cat-parent'
      );

      expect(result.success).toBe(false);
      expect(result.error).toContain('characters');
    });

    it('should sanitize input to prevent injection', async () => {
      const maliciousEmail = "test@example.com'; DROP TABLE users; --";
      const maliciousName = "<script>alert('xss')</script>";

      const result = await WaitlistService.addToWaitlist(
        maliciousEmail,
        maliciousName,
        'cat-parent'
      );

      // Should either reject the input or sanitize it
      expect(result.success).toBe(false);
    });
  });

  describe('error handling', () => {
    it('should handle network errors gracefully', async () => {
      mockSupabaseClient.from().insert.mockRejectedValueOnce(
        new Error('Network error')
      );

      const result = await WaitlistService.addToWaitlist(
        'test@example.com',
        'Test User',
        'cat-parent'
      );

      expect(result.success).toBe(false);
      expect(result.error).toContain('Network error');
    });

    it('should handle abort errors specifically', async () => {
      const abortError = new Error('Request aborted');
      abortError.name = 'AbortError';
      
      mockSupabaseClient.from().insert.mockRejectedValueOnce(abortError);

      const result = await WaitlistService.addToWaitlist(
        'test@example.com',
        'Test User',
        'cat-parent'
      );

      expect(result.success).toBe(false);
      expect(result.error).toContain('Request was cancelled');
    });
  });
});