import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { Experience } from '../components/Experience';
import { ExperiencePage } from '../pages/ExperiencePage';
import { experiences as staticExperiences } from '../data/experience';

vi.mock('../lib/api', () => ({
  getExperience: vi.fn(() => new Promise(() => {})), // in-flight -> immediate static fallback
  getResumeDownloadUrl: vi.fn(() => '/api/v1/resume/download/'),
  ApiError: class ApiError extends Error {
    status: number;
    constructor(message: string, status: number) {
      super(message);
      this.status = status;
    }
  },
}));

describe('Experience Component', () => {
  it('renders section title and static fallback experiences immediately', () => {
    render(
      <MemoryRouter>
        <Experience />
      </MemoryRouter>
    );

    expect(screen.getByRole('heading', { name: /experience/i, level: 2 })).toBeInTheDocument();
    expect(screen.getByText('Backend Development Trainee')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /view full timeline/i })).toBeInTheDocument();
  });
});

describe('ExperiencePage Component', () => {
  it('renders page header, type filters, and timeline entries', () => {
    render(
      <MemoryRouter initialEntries={['/experience']}>
        <ExperiencePage />
      </MemoryRouter>
    );

    expect(
      screen.getByRole('heading', {
        name: /professional experience - backend engineering/i,
        level: 1,
      })
    ).toBeInTheDocument();

    expect(screen.getByText('All Types')).toBeInTheDocument();
    expect(screen.getByText('Internship & Trainee')).toBeInTheDocument();
    expect(screen.getByText('Freelance')).toBeInTheDocument();
    expect(screen.getByText('Education')).toBeInTheDocument();

    expect(screen.getByText('Sajha Infotech Pvt. Ltd.')).toBeInTheDocument();
  });
});
