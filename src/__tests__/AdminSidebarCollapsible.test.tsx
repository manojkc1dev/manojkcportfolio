import React from 'react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { AdminSidebar } from '../pages/admin/AdminSidebar';
import { AdminHeader } from '../pages/admin/AdminHeader';
import { ThemeProvider } from '../context/ThemeContext';

describe('AdminSidebar & Navigation Refinement Tests', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('renders expanded by default with brand profile, name, ADMIN badge, and navigation groups', () => {
    render(
      <AdminSidebar
        currentTab="dashboard"
        onSelectTab={vi.fn()}
        isOpen={true}
        onCloseMobile={vi.fn()}
        onBackToHome={vi.fn()}
      />
    );

    const sidebar = screen.getByTestId('admin-sidebar');
    expect(sidebar).toHaveAttribute('data-collapsed', 'false');
    expect(sidebar.className).toContain('w-64');

    // Profile and brand inside sidebar
    expect(screen.getAllByText('Manoj Khatri').length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText('ADMIN')).toBeInTheDocument();
    expect(screen.queryByText('PORTFOLIO ADMIN')).not.toBeInTheDocument();

    // Static NAVIGATION label and old arrow toggle must NOT exist
    expect(screen.queryByText('NAVIGATION')).not.toBeInTheDocument();
    expect(screen.queryByTestId('chevron-left-toggle')).not.toBeInTheDocument();

    // Section headers and labels should be visible
    expect(screen.getByText('Overview')).toBeInTheDocument();
    expect(screen.getByText('Portfolio Content')).toBeInTheDocument();
    expect(screen.getByText('Communication')).toBeInTheDocument();
    expect(screen.getByText('System')).toBeInTheDocument();
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Projects & Demos')).toBeInTheDocument();
    expect(screen.getByText('Contact Inquiries')).toBeInTheDocument();

    // Hamburger button in sidebar controls collapse
    const toggleBtn = screen.getByTestId('admin-sidebar-collapse-toggle');
    expect(toggleBtn).toHaveAttribute('aria-label', 'Collapse sidebar');
    expect(toggleBtn).toHaveAttribute('aria-expanded', 'true');
  });

  it('hamburger toggle collapses and expands sidebar with localStorage persistence under admin_sidebar_collapsed', () => {
    const onSelectTab = vi.fn();
    render(
      <AdminSidebar
        currentTab="dashboard"
        onSelectTab={onSelectTab}
        isOpen={true}
        onCloseMobile={vi.fn()}
        onBackToHome={vi.fn()}
      />
    );

    const toggleBtn = screen.getByTestId('admin-sidebar-collapse-toggle');

    // Click hamburger to collapse
    fireEvent.click(toggleBtn);
    expect(localStorage.getItem('admin_sidebar_collapsed')).toBe('true');

    const sidebar = screen.getByTestId('admin-sidebar');
    expect(sidebar).toHaveAttribute('data-collapsed', 'true');
    expect(sidebar.className).toContain('lg:w-16');

    // Text labels should not be present in DOM in collapsed mode
    expect(screen.queryByText('Overview')).not.toBeInTheDocument();
    expect(screen.queryByText('Portfolio Content')).not.toBeInTheDocument();
    expect(screen.queryByText('Communication')).not.toBeInTheDocument();
    expect(screen.queryByText('ADMIN')).not.toBeInTheDocument();

    // Toggle button should now offer expansion
    expect(toggleBtn).toHaveAttribute('aria-label', 'Expand sidebar');
    expect(toggleBtn).toHaveAttribute('aria-expanded', 'false');

    // Click hamburger again to expand
    fireEvent.click(toggleBtn);
    expect(localStorage.getItem('admin_sidebar_collapsed')).toBe('false');
    expect(sidebar).toHaveAttribute('data-collapsed', 'false');
    expect(screen.getByText('Overview')).toBeInTheDocument();
    expect(screen.getByText('ADMIN')).toBeInTheDocument();
  });

  it('initializes in collapsed state when localStorage has admin_sidebar_collapsed = "true"', () => {
    localStorage.setItem('admin_sidebar_collapsed', 'true');

    render(
      <AdminSidebar
        currentTab="projects"
        onSelectTab={vi.fn()}
        isOpen={true}
        onCloseMobile={vi.fn()}
        onBackToHome={vi.fn()}
      />
    );

    const sidebar = screen.getByTestId('admin-sidebar');
    expect(sidebar).toHaveAttribute('data-collapsed', 'true');
    expect(sidebar.className).toContain('lg:w-16');
  });

  it('provides accessible titles, tooltips, and keyboard accessibility on nav items in collapsed mode', () => {
    localStorage.setItem('admin_sidebar_collapsed', 'true');
    const onSelectTab = vi.fn();

    render(
      <AdminSidebar
        currentTab="dashboard"
        onSelectTab={onSelectTab}
        isOpen={true}
        onCloseMobile={vi.fn()}
        onBackToHome={vi.fn()}
        unreadInquiriesCount={3}
      />
    );

    // Accessible buttons with title and aria-label
    const dashboardBtn = screen.getByRole('button', { name: 'Dashboard' });
    expect(dashboardBtn).toHaveAttribute('title', 'Dashboard');
    expect(dashboardBtn).toHaveAttribute('aria-current', 'page');

    const projectsBtn = screen.getByRole('button', { name: 'Projects & Demos' });
    expect(projectsBtn).toHaveAttribute('title', 'Projects & Demos');
    fireEvent.click(projectsBtn);
    expect(onSelectTab).toHaveBeenCalledWith('projects');

    const inquiriesBtn = screen.getByRole('button', { name: 'Contact Inquiries' });
    expect(inquiriesBtn).toHaveAttribute('title', 'Contact Inquiries (3 unread)');
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('renders dynamic breadcrumbs in AdminHeader without "Portfolio Admin" or ">" separators', () => {
    const { rerender } = render(
      <ThemeProvider>
        <AdminHeader
          currentTab="projects"
          onSelectTab={vi.fn()}
          onToggleSidebar={vi.fn()}
          onBackToHome={vi.fn()}
        />
      </ThemeProvider>
    );

    // Breadcrumbs for projects
    expect(screen.getByText('Portfolio Content')).toBeInTheDocument();
    expect(screen.getByText('/')).toBeInTheDocument();
    expect(screen.getByText('Projects')).toBeInTheDocument();
    expect(screen.queryByText('Portfolio Admin')).not.toBeInTheDocument();
    expect(screen.queryByText('>')).not.toBeInTheDocument();

    // Inquiries tab breadcrumb
    rerender(
      <ThemeProvider>
        <AdminHeader
          currentTab="inquiries"
          onSelectTab={vi.fn()}
          onToggleSidebar={vi.fn()}
          onBackToHome={vi.fn()}
        />
      </ThemeProvider>
    );
    expect(screen.getByText('Communication')).toBeInTheDocument();
    expect(screen.getByText('Inquiries')).toBeInTheDocument();

    // Settings tab breadcrumb
    rerender(
      <ThemeProvider>
        <AdminHeader
          currentTab="settings"
          onSelectTab={vi.fn()}
          onToggleSidebar={vi.fn()}
          onBackToHome={vi.fn()}
        />
      </ThemeProvider>
    );
    expect(screen.getByText('System')).toBeInTheDocument();
    expect(screen.getByText('Settings')).toBeInTheDocument();
  });

  it('supports controlled collapse props from AdminPortal', () => {
    const onToggleCollapse = vi.fn();
    const onSelectTab = vi.fn();

    const { rerender } = render(
      <AdminSidebar
        currentTab="dashboard"
        onSelectTab={onSelectTab}
        isOpen={true}
        onCloseMobile={vi.fn()}
        onBackToHome={vi.fn()}
        isCollapsed={false}
        onToggleCollapse={onToggleCollapse}
      />
    );

    expect(screen.getByTestId('admin-sidebar')).toHaveAttribute('data-collapsed', 'false');

    const toggleBtn = screen.getByTestId('admin-sidebar-collapse-toggle');
    fireEvent.click(toggleBtn);
    expect(onToggleCollapse).toHaveBeenCalledTimes(1);

    rerender(
      <AdminSidebar
        currentTab="dashboard"
        onSelectTab={onSelectTab}
        isOpen={true}
        onCloseMobile={vi.fn()}
        onBackToHome={vi.fn()}
        isCollapsed={true}
        onToggleCollapse={onToggleCollapse}
      />
    );

    expect(screen.getByTestId('admin-sidebar')).toHaveAttribute('data-collapsed', 'true');
  });
});
