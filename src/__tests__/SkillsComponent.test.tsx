import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { Skills } from '../components/Skills';

vi.mock('../lib/api', () => ({
  getSkills: vi.fn(() => new Promise(() => {})), // in-flight -> immediate static fallback
  ApiError: class ApiError extends Error {
    status: number;
    constructor(message: string, status: number) {
      super(message);
      this.status = status;
    }
  },
}));

describe('Skills Component', () => {
  it('renders section title and static fallback skill groups immediately', () => {
    render(
      <MemoryRouter>
        <Skills />
      </MemoryRouter>
    );

    expect(screen.getByRole('heading', { name: /skills & tooling/i, level: 2 })).toBeInTheDocument();
    expect(screen.getByText('Python')).toBeInTheDocument();
    expect(screen.getByText('Django')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /view all skills/i })).toBeInTheDocument();
  });
});
