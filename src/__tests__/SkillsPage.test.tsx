/**
 * Tests for SkillsPage — Django API integration, loading states, filters, and fallbacks.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { SkillsPage } from '../pages/SkillsPage';
import { skillGroups as defaultSkillGroups } from '../data/skills';
import type { SkillCategory } from '../types';

vi.mock('../lib/api/public', () => ({
  getSkills: vi.fn(),
}));

import { getSkills } from '../lib/api/public';
const mockGetSkills = vi.mocked(getSkills);

const mockApiCategories: SkillCategory[] = [
  {
    id: 'backend-cat',
    category: 'Backend & APIs',
    title: 'Backend Engineering',
    description: 'Server-side systems & APIs',
    skills: [
      {
        name: 'Python',
        proficiency: 'Advanced',
        level: 'advanced',
        highlight: true,
        years: 4,
      },
      {
        name: 'Django',
        proficiency: 'Advanced',
        level: 'expert',
        highlight: true,
        years: 3,
      },
    ],
  },
  {
    id: 'db-cat',
    category: 'Databases',
    title: 'Databases & Persistence',
    description: 'Relational data stores',
    skills: [
      {
        name: 'PostgreSQL',
        proficiency: 'Advanced',
        level: 'advanced',
        highlight: false,
        years: 3,
      },
    ],
  },
];

describe('SkillsPage Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders loading skeleton while API is in flight', () => {
    mockGetSkills.mockReturnValue(new Promise(() => {}));

    render(
      <MemoryRouter>
        <SkillsPage />
      </MemoryRouter>
    );

    const skeletonContainer = screen.getByLabelText(/Loading technical skills/i);
    expect(skeletonContainer).toBeInTheDocument();
    expect(skeletonContainer).toHaveAttribute('aria-busy', 'true');
  });

  it('fetches and renders skills from Django API on mount', async () => {
    mockGetSkills.mockResolvedValue(mockApiCategories);

    render(
      <MemoryRouter>
        <SkillsPage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.queryByLabelText(/Loading technical skills/i)).not.toBeInTheDocument();
    });

    expect(mockGetSkills).toHaveBeenCalledTimes(1);
    expect(screen.getByText('Backend Engineering')).toBeInTheDocument();
    expect(screen.getByText('Databases & Persistence')).toBeInTheDocument();
    expect(screen.getByText('Python')).toBeInTheDocument();
    expect(screen.getByText('Django')).toBeInTheDocument();
    expect(screen.getByText('PostgreSQL')).toBeInTheDocument();
  });

  it('falls back to static skillGroups when API fails', async () => {
    mockGetSkills.mockRejectedValue(new Error('Network offline'));

    render(
      <MemoryRouter>
        <SkillsPage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.queryByLabelText(/Loading technical skills/i)).not.toBeInTheDocument();
    });

    // Should render default static groups
    expect(screen.getByText(defaultSkillGroups[0].title)).toBeInTheDocument();
  });

  it('falls back to static skillGroups when API returns empty array', async () => {
    mockGetSkills.mockResolvedValue([]);

    render(
      <MemoryRouter>
        <SkillsPage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.queryByLabelText(/Loading technical skills/i)).not.toBeInTheDocument();
    });

    // Should render default static groups
    expect(screen.getByText(defaultSkillGroups[0].title)).toBeInTheDocument();
  });

  it('filters skills by search query', async () => {
    mockGetSkills.mockResolvedValue(mockApiCategories);

    render(
      <MemoryRouter initialEntries={['/skills?q=PostgreSQL']}>
        <SkillsPage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.queryByLabelText(/Loading technical skills/i)).not.toBeInTheDocument();
    });

    expect(screen.getByText('PostgreSQL')).toBeInTheDocument();
    expect(screen.queryByText('Python')).not.toBeInTheDocument();
  });

  it('filters skills by level chip', async () => {
    mockGetSkills.mockResolvedValue(mockApiCategories);

    render(
      <MemoryRouter initialEntries={['/skills?level=expert']}>
        <SkillsPage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.queryByLabelText(/Loading technical skills/i)).not.toBeInTheDocument();
    });

    expect(screen.getByText('Django')).toBeInTheDocument();
    expect(screen.queryByText('Python')).not.toBeInTheDocument();
  });

  it('renders current engineering focus callout banner when no strict filter is active', async () => {
    mockGetSkills.mockResolvedValue(mockApiCategories);

    render(
      <MemoryRouter>
        <SkillsPage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.queryByLabelText(/Loading technical skills/i)).not.toBeInTheDocument();
    });

    expect(screen.getByText(/Current Engineering Focus & Groundwork/i)).toBeInTheDocument();
  });

  it('shows empty state when search finds no results', async () => {
    mockGetSkills.mockResolvedValue(mockApiCategories);

    render(
      <MemoryRouter initialEntries={['/skills?q=nonexistenttech123']}>
        <SkillsPage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.queryByLabelText(/Loading technical skills/i)).not.toBeInTheDocument();
    });

    expect(screen.getByText(/No skills match your search/i)).toBeInTheDocument();
  });
});
