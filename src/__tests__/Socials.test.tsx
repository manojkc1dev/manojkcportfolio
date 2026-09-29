import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Hero } from '../components/Hero';
import { Footer } from '../components/Footer';
import { Contact } from '../components/Contact';

describe('Social Links and Email', () => {
  it('every social link points to @manojkc1dev handle', () => {
    const { container } = render(
      <>
        <Hero />
        <Footer />
      </>
    );

    const externalLinks = Array.from(container.querySelectorAll('a[target="_blank"]')) as HTMLAnchorElement[];
    const socialLinks = externalLinks.filter((link) => {
      const href = link.href;
      return (
        href.includes('github.com') ||
        href.includes('linkedin.com') ||
        href.includes('twitter.com') ||
        href.includes('instagram.com') ||
        href.includes('facebook.com') ||
        href.includes('tiktok.com')
      );
    });

    expect(socialLinks.length).toBeGreaterThan(0);
    socialLinks.forEach((link) => {
      expect(link.href.toLowerCase()).toContain('manojkc1dev');
    });

    // Ensure YouTube link is completely removed
    const youtubeLink = externalLinks.find((link) => link.href.includes('youtube.com'));
    expect(youtubeLink).toBeUndefined();
  });

  it('email link is mailto:manojkc1dev@gmail.com', () => {
    render(<Contact />);
    const mailLinks = screen.getAllByRole('link').filter((link) =>
      link.getAttribute('href')?.startsWith('mailto:')
    );

    expect(mailLinks.length).toBeGreaterThan(0);
    mailLinks.forEach((link) => {
      expect(link.getAttribute('href')).toContain('manojkc1dev@gmail.com');
    });
  });
});
