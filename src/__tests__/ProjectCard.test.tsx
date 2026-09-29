import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ProjectCard } from '../components/ProjectCard';
import type { Project } from '../types';

const mockProject: Project = {
  id: 'agritech',
  title: 'Agritech | Agriculture Marketplace Platform',
  tagline: 'Multi-vendor marketplace connecting farmers and buyers.',
  description: 'Role-based marketplace with JWT-secured APIs and payment integration.',
  highlights: ['Role-based auth with JWT', 'Khalti & eSewa payment gateway'],
  tech: ['Python', 'Django', 'DRF', 'PostgreSQL', 'React', 'Tailwind CSS', 'Docker'],
  links: {
    github: 'https://github.com/manojkc1dev/AgriTech_Marketplace',
    live: 'https://agritech-demo.example.com',
  },
  featured: true,
  image: '/images/agritech.png',
};

describe('ProjectCard Component', () => {
  it('renders Agritech title, tagline', () => {
    render(<ProjectCard project={mockProject} />);
    expect(screen.getByText('Agritech | Agriculture Marketplace Platform')).toBeInTheDocument();
    expect(screen.getByText('Multi-vendor marketplace connecting farmers and buyers.')).toBeInTheDocument();
  });

  it('renders all tech chips passed in', () => {
    render(<ProjectCard project={mockProject} />);
    mockProject.tech.forEach((tech) => {
      expect(screen.getByText(tech)).toBeInTheDocument();
    });
  });

  it('external links have rel="noopener noreferrer"', () => {
    render(<ProjectCard project={mockProject} />);
    const links = screen.getAllByRole('link');
    expect(links.length).toBeGreaterThan(0);
    links.forEach((link) => {
      expect(link).toHaveAttribute('rel', expect.stringContaining('noopener'));
      expect(link).toHaveAttribute('rel', expect.stringContaining('noreferrer'));
    });
  });

  it('external links have target="_blank"', () => {
    render(<ProjectCard project={mockProject} />);
    const links = screen.getAllByRole('link');
    expect(links.length).toBeGreaterThan(0);
    links.forEach((link) => {
      expect(link).toHaveAttribute('target', '_blank');
    });
  });
});
