import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Hero } from '../components/Hero';

describe('Hero Component', () => {
  it('renders name "Manoj Khatri"', () => {
    render(<Hero />);
    expect(screen.getByText('Manoj')).toBeInTheDocument();
    expect(screen.getByText('Khatri')).toBeInTheDocument();
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
    expect(downloadResumeBtn).toHaveAttribute('href', '/resume.pdf');
  });

  it('renders availability badge', () => {
    render(<Hero />);
    expect(screen.getByText(/available for work/i)).toBeInTheDocument();
  });
});
