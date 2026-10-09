import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AuthModal } from '../components/AuthModal';
import * as authApi from '../lib/api/auth';

vi.mock('../lib/api/auth', () => ({
  loginWithCredentials: vi.fn(),
  requestPasswordReset: vi.fn(),
  logout: vi.fn(),
  getCurrentUser: vi.fn(),
}));

describe('AuthModal Component (Django REST API Authentication)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders modal with email and password inputs in signin mode', () => {
    render(<AuthModal isOpen={true} onClose={vi.fn()} initialMode="signin" />);

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^password/i)).toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: /^sign in$/i }).length).toBeGreaterThan(0);
  });

  it('switches between Sign In, Register, and Reset tabs', () => {
    render(<AuthModal isOpen={true} onClose={vi.fn()} initialMode="signin" />);

    // Switch to Register
    const registerTab = screen.getByRole('button', { name: /^register$/i });
    fireEvent.click(registerTab);
    expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /create account/i })).toBeInTheDocument();

    // Switch to Reset
    const resetTab = screen.getByRole('button', { name: /^reset$/i });
    fireEvent.click(resetTab);
    expect(screen.queryByLabelText(/^password/i)).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: /send password reset email/i })).toBeInTheDocument();
  });

  it('submits credentials using loginWithCredentials function', async () => {
    vi.mocked(authApi.loginWithCredentials).mockResolvedValue({
      access: 'mock-access-token',
      refresh: 'mock-refresh-token',
      user: {
        id: 1,
        username: 'manojadmin',
        email: 'manojkc1dev@gmail.com',
        is_staff: true,
      },
    });

    const { container } = render(<AuthModal isOpen={true} onClose={vi.fn()} initialMode="signin" />);

    const emailInput = screen.getByLabelText(/email address/i);
    const passwordInput = screen.getByLabelText(/^password/i);
    const submitBtn = container.querySelector('#auth-submit-btn') as HTMLElement;

    fireEvent.change(emailInput, { target: { value: 'manojkc1dev@gmail.com' } });
    fireEvent.change(passwordInput, { target: { value: 'Secret123!' } });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(authApi.loginWithCredentials).toHaveBeenCalledWith('manojkc1dev@gmail.com', 'Secret123!');
    });
  });
});

