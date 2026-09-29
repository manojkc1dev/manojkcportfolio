import { describe, it, expect } from 'vitest';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ResumePreviewView } from '../components/admin/resume/preview/ResumePreviewView';
import { createDefaultResume } from '../lib/resume/schema';

describe('ResumePreviewView & Hide/Unhide functionality', () => {
  it('renders preview with correct A4 ratio watermark and controls', () => {
    const defaultResume = createDefaultResume('resume', 'master-v1');
    const onShowToast = () => {};

    render(
      <ResumePreviewView
        resume={defaultResume}
        allResumes={[defaultResume]}
        onShowToast={onShowToast}
      />
    );

    // Checks header & variant
    expect(screen.getByText('master-v1')).toBeInTheDocument();
    expect(screen.getAllByText(/RESUME/i)[0]).toBeInTheDocument();

    // Checks A4 Ratio watermark or selector
    expect(screen.getAllByText(/ISO A4/i).length).toBeGreaterThan(0);

    // Checks Hide / Unhide panel toggle
    expect(screen.getByText(/Visibility Manager/i)).toBeInTheDocument();
  });

  it('allows toggling contact fields and sections', () => {
    const defaultResume = createDefaultResume('resume', 'test-variant');
    const onShowToast = () => {};

    render(
      <ResumePreviewView
        resume={defaultResume}
        allResumes={[defaultResume]}
        onShowToast={onShowToast}
      />
    );

    // Find and click 1-Page Fit preset
    const onePageBtn = screen.getByText(/1-Page Fit/i);
    expect(onePageBtn).toBeInTheDocument();
    fireEvent.click(onePageBtn);

    // Save Visibility button should appear when there are unsaved changes
    expect(screen.getAllByText(/Save Visibility/i).length).toBeGreaterThan(0);
  });
});
