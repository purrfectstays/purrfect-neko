import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '../../../test/utils';
import CatteryOwnerCTA from '../CatteryOwnerCTA';

// Mock the useApp hook
const mockSetCurrentStep = vi.fn();

vi.mock('../../../context/AppContext', () => ({
  useApp: () => ({
    setCurrentStep: mockSetCurrentStep,
  }),
}));

describe('CatteryOwnerCTA', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render the component with correct content', () => {
    render(<CatteryOwnerCTA />);
    
    expect(screen.getByText('Register as a Cattery Owner')).toBeInTheDocument();
    expect(screen.getByText('Join our partner network and connect with quality cat parents in your area')).toBeInTheDocument();
    expect(screen.getByText('BECOME A PARTNER')).toBeInTheDocument();
    expect(screen.getByText('🚀 Early partners get reduced fees • Priority placement • Founding benefits')).toBeInTheDocument();
  });

  it('should have correct styling classes', () => {
    render(<CatteryOwnerCTA />);
    
    const container = screen.getByText('Register as a Cattery Owner').closest('div');
    expect(container?.parentElement).toHaveClass('bg-purple-600/80');
    expect(container?.parentElement).toHaveClass('backdrop-blur-sm');
    expect(container?.parentElement).toHaveClass('rounded-2xl');
    expect(container?.parentElement).toHaveClass('border-2');
    expect(container?.parentElement).toHaveClass('border-purple-400');
  });

  it('should display the correct button content', () => {
    render(<CatteryOwnerCTA />);
    
    const button = screen.getByRole('button', { name: /become a partner/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('w-full');
    expect(button).toHaveClass('bg-gradient-to-r');
    expect(button).toHaveClass('from-purple-400');
    expect(button).toHaveClass('to-purple-500');
  });

  it('should call setCurrentStep when button is clicked', () => {
    render(<CatteryOwnerCTA />);
    
    const button = screen.getByRole('button', { name: /become a partner/i });
    fireEvent.click(button);
    
    expect(mockSetCurrentStep).toHaveBeenCalledWith('registration');
    expect(mockSetCurrentStep).toHaveBeenCalledTimes(1);
  });

  it('should prevent default event behavior on click', () => {
    render(<CatteryOwnerCTA />);
    
    const button = screen.getByRole('button', { name: /become a partner/i });
    const clickEvent = new MouseEvent('click', { bubbles: true });
    const preventDefaultSpy = vi.spyOn(clickEvent, 'preventDefault');
    const stopPropagationSpy = vi.spyOn(clickEvent, 'stopPropagation');
    
    fireEvent(button, clickEvent);
    
    expect(preventDefaultSpy).toHaveBeenCalled();
    expect(stopPropagationSpy).toHaveBeenCalled();
  });

  it('should display the ArrowRight icon', () => {
    render(<CatteryOwnerCTA />);
    
    const button = screen.getByRole('button', { name: /become a partner/i });
    const svg = button.querySelector('svg');
    
    expect(svg).toBeInTheDocument();
    expect(svg).toHaveClass('w-6');
    expect(svg).toHaveClass('h-6');
  });

  it('should be accessible', () => {
    render(<CatteryOwnerCTA />);
    
    const button = screen.getByRole('button', { name: /become a partner/i });
    
    // Should be focusable
    expect(button).toHaveAttribute('type', 'button');
    
    // Should have proper button semantics
    expect(button.tagName).toBe('BUTTON');
    
    // Content should be readable
    expect(button).toHaveTextContent('BECOME A PARTNER');
  });

  it('should have hover effects in CSS classes', () => {
    render(<CatteryOwnerCTA />);
    
    const button = screen.getByRole('button', { name: /become a partner/i });
    
    expect(button).toHaveClass('hover:from-purple-500');
    expect(button).toHaveClass('hover:to-purple-600');
    expect(button).toHaveClass('hover:scale-105');
    expect(button).toHaveClass('transition-all');
    expect(button).toHaveClass('duration-300');
  });

  it('should handle keyboard navigation', () => {
    render(<CatteryOwnerCTA />);
    
    const button = screen.getByRole('button', { name: /become a partner/i });
    
    // Focus the button
    button.focus();
    expect(document.activeElement).toBe(button);
    
    // Press Enter
    fireEvent.keyDown(button, { key: 'Enter', code: 'Enter' });
    fireEvent.keyUp(button, { key: 'Enter', code: 'Enter' });
    
    expect(mockSetCurrentStep).toHaveBeenCalledWith('registration');
  });

  it('should handle multiple rapid clicks gracefully', () => {
    render(<CatteryOwnerCTA />);
    
    const button = screen.getByRole('button', { name: /become a partner/i });
    
    // Click multiple times rapidly
    fireEvent.click(button);
    fireEvent.click(button);
    fireEvent.click(button);
    
    // Should handle all clicks
    expect(mockSetCurrentStep).toHaveBeenCalledTimes(3);
    expect(mockSetCurrentStep).toHaveBeenCalledWith('registration');
  });

  it('should display benefits text correctly', () => {
    render(<CatteryOwnerCTA />);
    
    const benefitsText = screen.getByText(/early partners get reduced fees/i);
    
    expect(benefitsText).toBeInTheDocument();
    expect(benefitsText).toHaveClass('text-sm');
    expect(benefitsText).toHaveClass('text-purple-200');
  });

  it('should have proper text hierarchy', () => {
    render(<CatteryOwnerCTA />);
    
    const heading = screen.getByText('Register as a Cattery Owner');
    const description = screen.getByText(/join our partner network/i);
    const benefits = screen.getByText(/early partners get reduced fees/i);
    
    // Heading should be largest
    expect(heading).toHaveClass('text-3xl');
    expect(heading).toHaveClass('font-extrabold');
    
    // Description should be medium
    expect(description).toHaveClass('text-lg');
    
    // Benefits should be smallest
    expect(benefits).toHaveClass('text-sm');
  });

  it('should maintain consistent spacing', () => {
    render(<CatteryOwnerCTA />);
    
    const container = screen.getByText('Register as a Cattery Owner').closest('div');
    
    expect(container).toHaveClass('space-y-6');
    expect(container).toHaveClass('text-center');
  });
});