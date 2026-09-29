import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { formatAuthError } from '../firebase';
import { AuthModal } from '../components/AuthModal';

// Mock useAuth
const mockSignIn = vi.fn();
const mockSignUp = vi.fn();
const mockResetPassword = vi.fn();
const mockSignOut = vi.fn();

let mockCurrentUser: any = null;
let mockIsConfigured = true;

vi.mock('../firebase', async (importOriginal) => {
  const actual: any = await importOriginal();
  return {
    ...actual,
    useAuth: () => ({
      user: mockCurrentUser,
      loading: false,
      isConfigured: mockIsConfigured,
      error: null,
      signIn: mockSignIn,
      signUp: mockSignUp,
      resetPassword: mockResetPassword,
      signOut: mockSignOut,
    }),
  };
});

describe('Firebase Email/Password Authentication', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockCurrentUser = null;
    mockIsConfigured = true;
  });

  describe('formatAuthError utility', () => {
    it('formats invalid-credential error gracefully', () => {
      const err = new Error('Firebase: Error (auth/invalid-credential).');
      expect(formatAuthError(err)).toMatch(/invalid email or password/i);
    });

    it('formats user-not-found error gracefully', () => {
      const err = new Error('Firebase: Error (auth/user-not-found).');
      expect(formatAuthError(err)).toMatch(/no account exists/i);
    });

    it('formats email-already-in-use error gracefully', () => {
      const err = new Error('Firebase: Error (auth/email-already-in-use).');
      expect(formatAuthError(err)).toMatch(/already exists/i);
    });

    it('formats weak-password error gracefully', () => {
      const err = new Error('Firebase: Error (auth/weak-password).');
      expect(formatAuthError(err)).toMatch(/at least 6 characters/i);
    });

    it('formats operation-not-allowed error gracefully', () => {
      const err = new Error('Firebase: Error (auth/operation-not-allowed).');
      expect(formatAuthError(err)).toMatch(/email\/password sign-in provider is not enabled/i);
    });
  });

  describe('AuthModal Component', () => {
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

    it('submits credentials using signIn function', async () => {
      mockSignIn.mockResolvedValue({ email: 'manojkc1dev@gmail.com' });
      const { container } = render(<AuthModal isOpen={true} onClose={vi.fn()} initialMode="signin" />);

      const emailInput = screen.getByLabelText(/email address/i);
      const passwordInput = screen.getByLabelText(/^password/i);
      const submitBtn = container.querySelector('#auth-submit-btn') as HTMLElement;

      fireEvent.change(emailInput, { target: { value: 'manojkc1dev@gmail.com' } });
      fireEvent.change(passwordInput, { target: { value: 'Secret123!' } });
      fireEvent.click(submitBtn);

      await waitFor(() => {
        expect(mockSignIn).toHaveBeenCalledWith('manojkc1dev@gmail.com', 'Secret123!');
      });
    });

    it('displays active profile and sign-out option when user is signed in', () => {
      mockCurrentUser = { email: 'manojkc1dev@gmail.com', uid: 'admin-123' };
      render(<AuthModal isOpen={true} onClose={vi.fn()} />);

      expect(screen.getByText(/authentication active/i)).toBeInTheDocument();
      expect(screen.getAllByText(/manojkc1dev@gmail.com/i).length).toBeGreaterThan(0);
      expect(screen.getByRole('button', { name: /sign out/i })).toBeInTheDocument();
    });
  });
});
