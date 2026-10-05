import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Hero } from '../components/Hero';

// Mock the API module — Hero calls getProfile() and getResumeDownloadUrl()
vi.mock('../lib/api', () => ({
  getProfile: vi.fn(() => new Promise(() => {})), // never resolves → static fallback used
  getResumeDownloadUrl: vi.fn(() => '/api/v1/resume/download/'),
}));

describe('Hero Component', () => {
  it('renders name "Manoj K.C."', () => {
    render(<Hero />);
    expect(screen.getByText('Manoj')).toBeInTheDocument();
    expect(screen.getByText('K.C.')).toBeInTheDocument();
  });

  it('renders role "Backend Software Engineer"', () => {
    render(<Hero />);
    expect(screen.getByText('Backend Software Engineer')).toBeInTheDocument();
  });

  it('renders both CTA buttons ("View Work", "Download Resume")', () => {
    render(<Hero />);
    const viewWorkBtn = screen.getByRole('link', { name: /view work/i });
    const downloadResumeBtn = screen.getByRole('link', { name: /download resume/i });

    expect(viewWorkBtn).toBeInTheDocument();
    expect(downloadResumeBtn).toBeInTheDocument();
    // Resume button now points to the Django canonical download endpoint
    expect(downloadResumeBtn).toHaveAttribute('href', '/api/v1/resume/download/');
  });

  it('renders availability badge', () => {
    render(<Hero />);
    expect(screen.getByText(/available for work/i)).toBeInTheDocument();
  });
});
