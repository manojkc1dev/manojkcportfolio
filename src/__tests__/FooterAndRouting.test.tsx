import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Footer } from '../components/Footer';
import { AdminPortal } from '../pages/AdminPortal';
import { ThemeProvider } from '../context/ThemeContext';

describe('Enterprise Footer UI/UX', () => {
  it('renders enterprise footer with domain verification and social profiles', () => {
    render(<Footer />);

    // Domain verification badges
    const domainElements = screen.getAllByText(/manojkc1\.com\.np/i);
    expect(domainElements.length).toBeGreaterThan(0);

    // Systems availability & location telemetry
    expect(screen.getByText(/Available for remote work/i)).toBeInTheDocument();
    expect(screen.getByText(/Location Nepal/i)).toBeInTheDocument();
    expect(screen.queryByText(/All APIs Operational/i)).toBeNull();

    // Technical stack details
    expect(screen.getByText(/Python 3\.12 & Django 5\.x/i)).toBeInTheDocument();
    expect(screen.getByText(/Django REST Framework/i)).toBeInTheDocument();
    expect(screen.getByText(/PostgreSQL & Query Optimization/i)).toBeInTheDocument();

    // Direct email & phone
    expect(screen.getByText(/manojkc1dev@gmail\.com/i)).toBeInTheDocument();
    expect(screen.getByText(/\+977 9842203976/i)).toBeInTheDocument();

    // Ensure Admin Portal button is completely removed from public footer
    expect(screen.queryByText(/Admin Portal/i)).toBeNull();
    expect(screen.queryByTestId('footer-admin-btn')).toBeNull();
  });
});

describe('Canonical Admin Portal (/mkc-admin-z/)', () => {
  it('renders admin console signin interface with new clean heading', () => {
    render(
      <ThemeProvider>
        <AdminPortal onBackToHome={() => {}} />
      </ThemeProvider>
    );

    const manojKhatriEls = screen.getAllByText(/Manoj Khatri/i);
    expect(manojKhatriEls.length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText(/Portfolio Admin Dashboard/i)).toBeInTheDocument();
    expect(screen.getByText(/Email Address/i)).toBeInTheDocument();
    expect(screen.getByText(/^Password$/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Authenticate & Enter Console/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Return to Portfolio/i })).toBeInTheDocument();
    // Removed elements must not be present
    expect(screen.queryByText(/RESTRICTED ZONE/i)).toBeNull();
    expect(screen.queryByText(/Manage projects.*services/i)).toBeNull();
    expect(screen.queryByText(/Auth: Python\/Django REST API/i)).toBeNull();
  });
});
