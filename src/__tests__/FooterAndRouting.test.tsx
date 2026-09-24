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

    // Systems operational telemetry
    expect(screen.getByText(/All APIs Operational/i)).toBeInTheDocument();

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

describe('Secret Admin Portal (/lc-zadmin-cc/)', () => {
  it('renders admin console signin interface with restricted zone notice', () => {
    render(
      <ThemeProvider>
        <AdminPortal onBackToHome={() => {}} />
      </ThemeProvider>
    );

    expect(screen.getByText(/Portfolio Admin Console/i)).toBeInTheDocument();
    expect(screen.getByText(/RESTRICTED ZONE · PORTFOLIO CONSOLE/i)).toBeInTheDocument();
    expect(screen.getByText(/Admin Email Address/i)).toBeInTheDocument();
    expect(screen.getByText(/Passphrase/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Authenticate & Enter Console/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Return to Portfolio/i })).toBeInTheDocument();
  });
});
