import React from 'react';
import { createClient } from '@/lib/supabase/server';
import { NavbarClient, type NavItem } from './NavbarClient';

const DEFAULT_NAV_ITEMS: NavItem[] = [
  { label: 'About', href: '/#about' },
  { label: 'Tech Stack', href: '/#tech-stack' },
  { label: 'Projects', href: '/#projects' },
  { label: 'Process', href: '/#process' },
  { label: 'Contact', href: '/#contact' },
];

export async function Navbar() {
  let navItems = DEFAULT_NAV_ITEMS;
  let availabilityBadge = 'Available';

  try {
    const supabase = await createClient();
    const { data: navData, error: navError } = await supabase
      .from('navigation')
      .select('title, url, is_external, sort_order')
      .eq('location', 'header')
      .eq('status', 'published')
      .order('sort_order', { ascending: true });

    if (!navError && navData && navData.length > 0) {
      navItems = navData.map((item) => ({
        label: item.title,
        href: item.url,
        isExternal: item.is_external || false,
      }));
    }

    // Attempt to load availability from hero table
    const { data: heroData } = await supabase
      .from('hero')
      .select('availability_badge')
      .eq('status', 'published')
      .limit(1)
      .maybeSingle();

    if (heroData?.availability_badge) {
      availabilityBadge = heroData.availability_badge.replace(/^[⚡\s]+/, '');
    }
  } catch {
    // If Supabase not initialized or database empty, use default verified seed items
  }

  return (
    <NavbarClient
      navItems={navItems}
      availabilityBadge={availabilityBadge}
    />
  );
}
