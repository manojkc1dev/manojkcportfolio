import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import App from '../App';
import { AdminPortal } from '../pages/AdminPortal';
import { Contact } from '../components/Contact';
import { ThemeProvider } from '../context/ThemeContext';
import * as authApi from '../lib/api/auth';

vi.mock('../lib/api/client', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../lib/api/client')>();
  return {
    ...actual,
    isDjangoConfigured: true,
    DJANGO_API_BASE_URL: 'http://localhost:8000',
  };
});

vi.mock('../lib/djangoApi', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../lib/djangoApi')>();
  return {
    ...actual,
    isDjangoConfigured: true,
  };
});

vi.mock('../lib/api/auth', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../lib/api/auth')>();
  return {
    ...actual,
    getCurrentUser: vi.fn().mockResolvedValue({
      id: 1,
      username: 'testuser',
      email: 'contactmanojkc1.com.np@gmail.com',
      is_staff: true,
    }),
    loginWithCredentials: vi.fn().mockResolvedValue({
      access: 'mock-access-token',
      refresh: 'mock-refresh-token',
      user: { id: 1, username: 'testuser', email: 'contactmanojkc1.com.np@gmail.com' },
    }),
    requestPasswordReset: vi.fn().mockResolvedValue({
      detail: 'Password reset instructions have been sent.',
    }),
  };
});

vi.mock('../lib/api/admin', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../lib/api/admin')>();
  return {
    ...actual,
    getAdminProjects: vi.fn().mockResolvedValue([]),
  };
});

vi.mock('../lib/api/inquiries', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../lib/api/inquiries')>();
  return {
    ...actual,
    getAdminInquiries: vi.fn().mockResolvedValue([]),
  };
});

describe('Admin Route & Canonical Security Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    sessionStorage.clear();
  });

  describe('1. Routing Verification', () => {
    it('renders AdminPortal on canonical route /mkc-admin-z', async () => {
      window.history.pushState({}, '', '/mkc-admin-z');
      render(<App />);

      await waitFor(() => {
        expect(screen.getByText(/Portfolio Admin Dashboard/i)).toBeInTheDocument();
      });
      expect(screen.getByText(/Email Address/i)).toBeInTheDocument();
    });

    it('renders AdminPortal on canonical route with trailing slash /mkc-admin-z/', async () => {
      window.history.pushState({}, '', '/mkc-admin-z/');
      render(<App />);

      await waitFor(() => {
        expect(screen.getByText(/Portfolio Admin Dashboard/i)).toBeInTheDocument();
      });
    });

    it('does not route old /admin as the canonical admin route', async () => {
      window.history.pushState({}, '', '/admin');
      render(<App />);

      await waitFor(() => {
        // Old /admin should fall through to 404 / NotFound rather than AdminPortal
        expect(screen.getByText(/Route Not Registered/i)).toBeInTheDocument();
        expect(screen.queryByText(/Portfolio Admin Dashboard/i)).toBeNull();
      });
    });
  });

  describe('2. Authentication & Error Handling', () => {
    it('displays generic "Invalid email or password." on wrong password or email', async () => {
      vi.spyOn(authApi, 'loginWithCredentials').mockRejectedValue(
        new Error('Invalid email or password.')
      );

      render(
        <ThemeProvider>
          <AdminPortal onBackToHome={() => {}} />
        </ThemeProvider>
      );

      const emailInput = screen.getByPlaceholderText(/admin@gmail\.com/i);
      const passwordInput = screen.getByPlaceholderText(/••••••••/i);
      const submitBtn = screen.getByRole('button', { name: /Authenticate & Enter Console/i });

      fireEvent.change(emailInput, { target: { value: 'wrong@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'wrongpass' } });
      fireEvent.click(submitBtn);

      await waitFor(() => {
        expect(screen.getByText('Invalid email or password.')).toBeInTheDocument();
      });

      // Confirm no account enumeration strings are shown
      expect(screen.queryByText(/User not found/i)).toBeNull();
      expect(screen.queryByText(/No active account/i)).toBeNull();
    });

    it('displays generic "Unable to authenticate right now. Please try again." on network error', async () => {
      vi.spyOn(authApi, 'loginWithCredentials').mockRejectedValue(
        new TypeError('Failed to fetch (network error)')
      );

      render(
        <ThemeProvider>
          <AdminPortal onBackToHome={() => {}} />
        </ThemeProvider>
      );

      const emailInput = screen.getByPlaceholderText(/admin@gmail\.com/i);
      const passwordInput = screen.getByPlaceholderText(/••••••••/i);
      const submitBtn = screen.getByRole('button', { name: /Authenticate & Enter Console/i });

      fireEvent.change(emailInput, { target: { value: 'contactmanojkc1.com.np@gmail.com' } });
      fireEvent.change(passwordInput, { target: { value: 'ValidPass123!' } });
      fireEvent.click(submitBtn);

      await waitFor(() => {
        expect(screen.getByText('Unable to authenticate right now. Please try again.')).toBeInTheDocument();
      });
    });

    it('successfully logs in and displays dashboard on valid Django JWT authentication', async () => {
      localStorage.setItem('portfolio_django_access_token', 'valid-token');
      sessionStorage.setItem('portfolio_django_access_token', 'valid-token');
      vi.spyOn(authApi, 'getCurrentUser').mockResolvedValue({
        id: 1,
        username: 'testuser',
        email: 'contactmanojkc1.com.np@gmail.com',
        is_staff: true,
      });

      render(
        <ThemeProvider>
          <AdminPortal onBackToHome={() => {}} />
        </ThemeProvider>
      );

      await waitFor(() => {
        expect(screen.getByText('ADMIN')).toBeInTheDocument();
      });
      expect(screen.getAllByText('Manoj Khatri').length).toBeGreaterThanOrEqual(1);
    });

    it('does not allow localStorage flags to bypass authentication', () => {
      localStorage.setItem('portfolio_admin_session', 'true');
      localStorage.setItem('lightcode_admin_session', 'true');
      localStorage.setItem('localAdminAuthenticated', 'true');

      render(
        <ThemeProvider>
          <AdminPortal onBackToHome={() => {}} />
        </ThemeProvider>
      );

      // Must still show the login screen
      expect(screen.getByText(/Portfolio Admin Dashboard/i)).toBeInTheDocument();
      expect(screen.queryByText(/Control Center/i)).toBeNull();
    });
  });

  describe('3. Password Reset Workflow', () => {
    it('allows initiating password reset for authorized admin email', async () => {
      vi.spyOn(authApi, 'requestPasswordReset').mockResolvedValue({
        detail: 'Password reset instructions have been sent.',
      });

      render(
        <ThemeProvider>
          <AdminPortal onBackToHome={() => {}} />
        </ThemeProvider>
      );

      const forgotBtn = screen.getByRole('button', { name: /Forgot password\?/i });
      fireEvent.click(forgotBtn);

      expect(screen.getByText(/Authorized Admin Email Address/i)).toBeInTheDocument();

      const resetEmailInput = screen.getByPlaceholderText(/admin@gmail\.com/i);
      const sendBtn = screen.getByRole('button', { name: /Send Password Reset Email/i });

      fireEvent.change(resetEmailInput, { target: { value: 'contactmanojkc1.com.np@gmail.com' } });
      fireEvent.click(sendBtn);

      await waitFor(() => {
        expect(screen.getByText(/Reset Instructions Sent/i)).toBeInTheDocument();
      });
    });

    it('shows generic "Invalid email or password." when unauthorized email attempts reset', async () => {
      vi.spyOn(authApi, 'requestPasswordReset').mockRejectedValue(
        new Error('Invalid email or password.')
      );

      render(
        <ThemeProvider>
          <AdminPortal onBackToHome={() => {}} />
        </ThemeProvider>
      );

      const forgotBtn = screen.getByRole('button', { name: /Forgot password\?/i });
      fireEvent.click(forgotBtn);

      const resetEmailInput = screen.getByPlaceholderText(/admin@gmail\.com/i);
      const sendBtn = screen.getByRole('button', { name: /Send Password Reset Email/i });

      fireEvent.change(resetEmailInput, { target: { value: 'attacker@evil.com' } });
      fireEvent.click(sendBtn);

      await waitFor(() => {
        expect(screen.getByText('Invalid email or password.')).toBeInTheDocument();
      });
    });
  });

  describe('4. Public Contact Information & Clean Copy', () => {
    it('displays public contact email as manojkc1dev@gmail.com with correct mailto link', () => {
      render(
        <MemoryRouter>
          <Contact />
        </MemoryRouter>
      );

      const emailLink = screen.getByRole('link', { name: /manojkc1dev@gmail\.com/i });
      expect(emailLink).toBeInTheDocument();
      expect(emailLink).toHaveAttribute('href', 'mailto:manojkc1dev@gmail.com');

      // Admin email should NOT be present in public contact UI
      expect(screen.queryByText(/contactmanojkc1\.com\.np@gmail\.com/i)).toBeNull();
    });

    it('renders clean pitch copy and does not show obsolete Firebase warning', () => {
      render(
        <MemoryRouter>
          <Contact />
        </MemoryRouter>
      );

      expect(screen.getByText(/Let's build something reliable\./i)).toBeInTheDocument();
      expect(
        screen.getByText(/Open to remote backend freelance contracts and junior backend roles/i)
      ).toBeInTheDocument();

      // Obsolete Firebase UI-only notice must be gone
      expect(screen.queryByText(/UI-Only Mode/i)).toBeNull();
      expect(screen.queryByText(/Firebase is not configured/i)).toBeNull();
    });
  });
});
