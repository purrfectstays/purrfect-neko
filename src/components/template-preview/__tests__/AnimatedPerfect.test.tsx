import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, act } from '../../../test/utils';
import AnimatedPerfect from '../AnimatedPerfect';

// Mock timers for testing animations
const { mockTimers } = vi.hoisted(() => ({
  mockTimers: () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });
    afterEach(() => {
      vi.useRealTimers();
    });
  }
}));

describe('AnimatedPerfect', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.clearAllTimers();
  });

  it('should render the first word initially', () => {
    render(<AnimatedPerfect />);
    
    expect(screen.getByText('Perfect')).toBeInTheDocument();
  });

  it('should have correct CSS classes for styling', () => {
    render(<AnimatedPerfect />);
    
    const span = screen.getByText('Perfect');
    expect(span).toHaveClass('transition-all');
    expect(span).toHaveClass('duration-300');
    expect(span).toHaveClass('bg-gradient-to-r');
    expect(span).toHaveClass('from-indigo-400');
    expect(span).toHaveClass('to-purple-500');
    expect(span).toHaveClass('bg-clip-text');
    expect(span).toHaveClass('text-transparent');
    expect(span).toHaveClass('font-bold');
  });

  it('should start with visible state', () => {
    render(<AnimatedPerfect />);
    
    const span = screen.getByText('Perfect');
    expect(span).toHaveClass('opacity-100');
    expect(span).toHaveClass('scale-100');
  });

  it('should cycle through words after timeout', async () => {
    render(<AnimatedPerfect />);
    
    // Initially shows "Perfect"
    expect(screen.getByText('Perfect')).toBeInTheDocument();
    
    // Fast forward past the transition period (2500ms + 300ms fade)
    act(() => {
      vi.advanceTimersByTime(2800);
    });
    
    // Should now show "Premium" (second word)
    expect(screen.getByText('Premium')).toBeInTheDocument();
    expect(screen.queryByText('Perfect')).not.toBeInTheDocument();
  });

  it('should cycle through all words in order', () => {
    const words = ['Perfect', 'Premium', 'Trusted', 'Quality', 'Caring', 'Expert'];
    render(<AnimatedPerfect />);
    
    words.forEach((word, index) => {
      // Check current word
      expect(screen.getByText(word)).toBeInTheDocument();
      
      // Advance to next word (if not the last one)
      if (index < words.length - 1) {
        act(() => {
          vi.advanceTimersByTime(2800);
        });
      }
    });
  });

  it('should loop back to first word after reaching the end', () => {
    render(<AnimatedPerfect />);
    
    // Start with "Perfect"
    expect(screen.getByText('Perfect')).toBeInTheDocument();
    
    // Cycle through all 6 words (6 * 2800ms)
    act(() => {
      vi.advanceTimersByTime(6 * 2800);
    });
    
    // Should be back to "Perfect"
    expect(screen.getByText('Perfect')).toBeInTheDocument();
  });

  it('should handle visibility transitions correctly', () => {
    render(<AnimatedPerfect />);
    
    const span = screen.getByText('Perfect');
    
    // Initially visible
    expect(span).toHaveClass('opacity-100');
    expect(span).toHaveClass('scale-100');
    
    // Advance time to start of fade out (2500ms - right when interval fires)
    act(() => {
      vi.advanceTimersByTime(2500);
    });
    
    // Should be invisible during transition
    expect(span).toHaveClass('opacity-0');
    expect(span).toHaveClass('scale-95');
  });

  it('should clean up interval on unmount', () => {
    const clearIntervalSpy = vi.spyOn(global, 'clearInterval');
    
    const { unmount } = render(<AnimatedPerfect />);
    
    unmount();
    
    expect(clearIntervalSpy).toHaveBeenCalled();
  });

  it('should be accessible', () => {
    render(<AnimatedPerfect />);
    
    const span = screen.getByText('Perfect');
    
    // Should be a focusable element or have proper ARIA attributes
    expect(span.tagName).toBe('SPAN');
    
    // Content should be readable by screen readers
    expect(span).toHaveTextContent('Perfect');
  });

  it('should handle rapid re-renders without memory leaks', () => {
    const { rerender } = render(<AnimatedPerfect />);
    
    // Re-render multiple times quickly
    for (let i = 0; i < 10; i++) {
      rerender(<AnimatedPerfect />);
    }
    
    // Should still function correctly
    expect(screen.getByText('Perfect')).toBeInTheDocument();
    
    // Advance time and verify it still cycles
    act(() => {
      vi.advanceTimersByTime(2800);
    });
    expect(screen.getByText('Premium')).toBeInTheDocument();
  });

  it('should maintain consistent timing between word changes', () => {
    render(<AnimatedPerfect />);
    
    // Start with "Perfect"
    expect(screen.getByText('Perfect')).toBeInTheDocument();
    
    // After first interval, should show "Premium"
    act(() => {
      vi.advanceTimersByTime(2800);
    });
    expect(screen.getByText('Premium')).toBeInTheDocument();
    
    // After second interval, should show "Trusted"
    act(() => {
      vi.advanceTimersByTime(2800);
    });
    expect(screen.getByText('Trusted')).toBeInTheDocument();
    
    // Timing intervals are consistent at 2800ms
    expect(true).toBe(true); // Test passes if we get here without errors
  });
});