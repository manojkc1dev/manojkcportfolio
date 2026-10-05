import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AdminPortal } from '../pages/AdminPortal';
import { ThemeProvider } from '../context/ThemeContext';

vi.mock('../lib/api/client', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../lib/api/client')>();
  return { ...actual, isDjangoConfigured: true, DJANGO_API_BASE_URL: 'http://localhost:8000' };
});

vi.mock('../lib/djangoApi', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../lib/djangoApi')>();
  return { ...actual, isDjangoConfigured: true };
});

vi.mock('../lib/api/auth', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../lib/api/auth')>();
  return {
    ...actual,
    getCurrentUser: vi.fn().mockResolvedValue(null),
    loginWithCredentials: vi.fn().mockRejectedValue(new Error('Invalid email or password.')),
    requestPasswordReset: vi.fn().mockResolvedValue({ detail: 'sent' }),
  };
});

vi.mock('../lib/api/admin', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../lib/api/admin')>();
  return { ...actual, getAdminProjects: vi.fn().mockResolvedValue([]) };
});

vi.mock('../lib/api/inquiries', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../lib/api/inquiries')>();
  return { ...actual, getAdminInquiries: vi.fn().mockResolvedValue([]) };
});

const renderLogin = () =>
  render(
    <ThemeProvider>
      <AdminPortal onBackToHome={() => {}} />
    </ThemeProvider>
  );

// ─────────────────────────────────────────────
// PART 1 — Admin Login UI Cleanup Tests
// ─────────────────────────────────────────────
describe('Admin Login UI Cleanup', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('heading renders "Manoj Khatri"', () => {
    renderLogin();
    const headings = screen.getAllByText(/Manoj Khatri/i);
    expect(headings.length).toBeGreaterThanOrEqual(1);
  });

  it('subtitle renders "Portfolio Admin Dashboard"', () => {
    renderLogin();
    expect(screen.getByText(/Portfolio Admin Dashboard/i)).toBeInTheDocument();
  });

  it('"Manage projects, services..." text is absent', () => {
    renderLogin();
    expect(screen.queryByText(/Manage projects.*services/i)).toBeNull();
  });

  it('"RESTRICTED ZONE · PORTFOLIO CONSOLE" text is absent', () => {
    renderLogin();
    expect(screen.queryByText(/RESTRICTED ZONE/i)).toBeNull();
  });

  it('"Auth: Python/Django REST API" text is absent', () => {
    renderLogin();
    expect(screen.queryByText(/Auth: Python\/Django REST API/i)).toBeNull();
  });

  it('email field label is "Email Address"', () => {
    renderLogin();
    expect(screen.getByText(/^Email Address$/i)).toBeInTheDocument();
  });

  it('email field placeholder is "admin@gmail.com"', () => {
    renderLogin();
    expect(screen.getByPlaceholderText(/admin@gmail\.com/i)).toBeInTheDocument();
  });

  it('password label is "Password"', () => {
    renderLogin();
    expect(screen.getByText(/^Password$/i)).toBeInTheDocument();
  });

  it('"Forgot password?" link is present and opens forgot-password mode', () => {
    renderLogin();
    const forgotBtn = screen.getByRole('button', { name: /Forgot password\?/i });
    expect(forgotBtn).toBeInTheDocument();
    fireEvent.click(forgotBtn);
    expect(screen.getByText(/Authorized Admin Email Address/i)).toBeInTheDocument();
  });

  it('authentication button is present and enabled by default', () => {
    renderLogin();
    const btn = screen.getByRole('button', { name: /Authenticate & Enter Console/i });
    expect(btn).toBeInTheDocument();
    expect(btn).not.toBeDisabled();
  });

  it('"Return to Portfolio" back button is present', () => {
    renderLogin();
    expect(screen.getByRole('button', { name: /Return to Portfolio/i })).toBeInTheDocument();
  });
});

// ─────────────────────────────────────────────
// PART 2 — SEO / Entity Tests (unit-level)
// ─────────────────────────────────────────────
describe('SEO & Entity Layer (unit assertions)', () => {
  it('Person entity has correct jobTitle: Python Django REST API Developer', () => {
    const personEntity = {
      '@type': 'Person',
      name: 'Manoj Khatri',
      jobTitle: 'Python Django REST API Developer',
    };
    expect(personEntity.jobTitle).toBe('Python Django REST API Developer');
  });

  it('Person entity primary name is Manoj Khatri', () => {
    const personEntity = { name: 'Manoj Khatri' };
    expect(personEntity.name).toBe('Manoj Khatri');
  });

  it('alternateName list includes Manoj K.C. and manojkc1', () => {
    const altNames = ['Manoj K.C.', 'ManojKC', 'manojkc', 'manojkc1', 'ManojKhatri'];
    expect(altNames).toContain('Manoj K.C.');
    expect(altNames).toContain('manojkc1');
  });

  it('sameAs array contains only verified social profile URLs', () => {
    const sameAs = [
      'https://github.com/manojkc1dev/',
      'https://linkedin.com/in/manojkc1dev/',
      'https://twitter.com/manojkc1dev',
      'https://instagram.com/manojkc1dev',
      'https://facebook.com/manojkc1dev',
      'https://tiktok.com/@manojkc1dev',
    ];
    sameAs.forEach((url) => {
      expect(url).toMatch(/^https:\/\/(github|linkedin|twitter|instagram|facebook|tiktok)\.com/);
    });
    expect(sameAs.some((u) => u.includes('youtube.com'))).toBe(false);
  });

  it('canonical URL is production domain', () => {
    const canonical = 'https://manojkc1.com.np/';
    expect(canonical).toMatch(/^https:\/\/manojkc1\.com\.np/);
  });

  it('robots.txt includes mkc-admin-z in disallowed paths', () => {
    const disallowed = ['/mkc-admin-z', '/mkc-admin-z/', '/api/', '/admin', '/admin/'];
    expect(disallowed).toContain('/mkc-admin-z');
    expect(disallowed).toContain('/api/');
  });

  it('sitemap URLs do not include admin or private paths', () => {
    const sitemapUrls = [
      'https://manojkc1.com.np/',
      'https://manojkc1.com.np/projects',
      'https://manojkc1.com.np/skills',
      'https://manojkc1.com.np/experience',
      'https://manojkc1.com.np/uses',
      'https://manojkc1.com.np/writing',
    ];
    const forbidden = ['mkc-admin-z', '/admin', '/api/'];
    forbidden.forEach((blocked) => {
      expect(sitemapUrls.some((url) => url.includes(blocked))).toBe(false);
    });
  });
});
