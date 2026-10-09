import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { SettingsView } from '../pages/admin/views/SettingsView';
import { initialProjects, initialInquiries, initialSiteContent } from '../pages/admin/mockData';

describe('Admin Password Change Flow (Django JWT Authentication)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  const dummyAllData = {
    projects: initialProjects,
    inquiries: initialInquiries,
    content: initialSiteContent,
  };

  it('renders password change form with all required inputs and Django JWT badge', () => {
    render(
      <SettingsView
        currentUserEmail="admin@manojkc1.com.np"
        isDjangoAuth={true}
        onUpdatePassword={vi.fn()}
        onShowToast={vi.fn()}
        allData={dummyAllData}
        onImportAllData={vi.fn()}
      />
    );

    expect(screen.getByText(/change master admin passphrase/i)).toBeInTheDocument();
    expect(screen.getByText(/^django jwt$/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/enter your current passphrase/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/at least 6 characters/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/repeat new passphrase/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /update passphrase/i })).toBeInTheDocument();
  });


  it('validates that current passphrase is required', async () => {
    const mockUpdatePassword = vi.fn();
    render(
      <SettingsView
        currentUserEmail="admin@manojkc1.com.np"
        isDjangoAuth={true}
        onUpdatePassword={mockUpdatePassword}
        onShowToast={vi.fn()}
        allData={dummyAllData}
        onImportAllData={vi.fn()}
      />
    );

    const submitBtn = screen.getByRole('button', { name: /update passphrase/i });
    fireEvent.click(submitBtn);

    expect(mockUpdatePassword).not.toHaveBeenCalled();
  });

  it('validates minimum length for new passphrase', async () => {
    const mockUpdatePassword = vi.fn();
    render(
      <SettingsView
        currentUserEmail="admin@manojkc1.com.np"
        isDjangoAuth={true}
        onUpdatePassword={mockUpdatePassword}
        onShowToast={vi.fn()}
        allData={dummyAllData}
        onImportAllData={vi.fn()}
      />
    );

    const currentInput = screen.getByPlaceholderText(/enter your current passphrase/i);
    const newInput = screen.getByPlaceholderText(/at least 6 characters/i);
    const confirmInput = screen.getByPlaceholderText(/repeat new passphrase/i);
    const submitBtn = screen.getByRole('button', { name: /update passphrase/i });

    fireEvent.change(currentInput, { target: { value: 'oldpass123' } });
    fireEvent.change(newInput, { target: { value: '123' } });
    fireEvent.change(confirmInput, { target: { value: '123' } });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText(/at least 6 characters/i)).toBeInTheDocument();
    });
    expect(mockUpdatePassword).not.toHaveBeenCalled();
  });

  it('validates that new passphrase and confirmation must match', async () => {
    const mockUpdatePassword = vi.fn();
    render(
      <SettingsView
        currentUserEmail="admin@manojkc1.com.np"
        isDjangoAuth={true}
        onUpdatePassword={mockUpdatePassword}
        onShowToast={vi.fn()}
        allData={dummyAllData}
        onImportAllData={vi.fn()}
      />
    );

    const currentInput = screen.getByPlaceholderText(/enter your current passphrase/i);
    const newInput = screen.getByPlaceholderText(/at least 6 characters/i);
    const confirmInput = screen.getByPlaceholderText(/repeat new passphrase/i);
    const submitBtn = screen.getByRole('button', { name: /update passphrase/i });

    fireEvent.change(currentInput, { target: { value: 'oldpass123' } });
    fireEvent.change(newInput, { target: { value: 'newsecurepass1' } });
    fireEvent.change(confirmInput, { target: { value: 'mismatchpass2' } });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText(/passphrase and confirmation do not match/i)).toBeInTheDocument();
    });
    expect(mockUpdatePassword).not.toHaveBeenCalled();
  });

  it('calls onUpdatePassword with (currentPass, newPass) and disables button during update', async () => {
    let resolvePasswordUpdate: () => void = () => {};
    const mockUpdatePassword = vi.fn().mockImplementation(
      () =>
        new Promise<void>((resolve) => {
          resolvePasswordUpdate = resolve;
        })
    );

    render(
      <SettingsView
        currentUserEmail="admin@manojkc1.com.np"
        isDjangoAuth={true}
        onUpdatePassword={mockUpdatePassword}
        onShowToast={vi.fn()}
        allData={dummyAllData}
        onImportAllData={vi.fn()}
      />
    );

    const currentInput = screen.getByPlaceholderText(/enter your current passphrase/i);
    const newInput = screen.getByPlaceholderText(/at least 6 characters/i);
    const confirmInput = screen.getByPlaceholderText(/repeat new passphrase/i);
    const submitBtn = screen.getByRole('button', { name: /update passphrase/i });

    fireEvent.change(currentInput, { target: { value: 'oldpass123' } });
    fireEvent.change(newInput, { target: { value: 'newsecret2026' } });
    fireEvent.change(confirmInput, { target: { value: 'newsecret2026' } });
    fireEvent.click(submitBtn);

    expect(mockUpdatePassword).toHaveBeenCalledWith('oldpass123', 'newsecret2026');

    // Loading state is active
    expect(screen.getByText(/updating passphrase\.{3}/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /updating passphrase\.{3}/i })).toBeDisabled();

    // Resolve operation
    resolvePasswordUpdate();

    await waitFor(() => {
      expect(screen.getByText(/updated successfully/i)).toBeInTheDocument();
    });

    // Inputs cleared on success
    expect(currentInput).toHaveValue('');
    expect(newInput).toHaveValue('');
    expect(confirmInput).toHaveValue('');
  });

  it('does NOT clear inputs and displays error message when backend rejects the password change', async () => {

    const mockUpdatePassword = vi
      .fn()
      .mockRejectedValue(new Error('Current passphrase is incorrect. Please verify and try again.'));

    render(
      <SettingsView
        currentUserEmail="admin@manojkc1.com.np"
        isDjangoAuth={true}
        onUpdatePassword={mockUpdatePassword}
        onShowToast={vi.fn()}
        allData={dummyAllData}
        onImportAllData={vi.fn()}
      />
    );

    const currentInput = screen.getByPlaceholderText(/enter your current passphrase/i);
    const newInput = screen.getByPlaceholderText(/at least 6 characters/i);
    const confirmInput = screen.getByPlaceholderText(/repeat new passphrase/i);
    const submitBtn = screen.getByRole('button', { name: /update passphrase/i });

    fireEvent.change(currentInput, { target: { value: 'wrongpass' } });
    fireEvent.change(newInput, { target: { value: 'newsecret2026' } });
    fireEvent.change(confirmInput, { target: { value: 'newsecret2026' } });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText(/current passphrase is incorrect/i)).toBeInTheDocument();
    });

    // Inputs are NOT wiped on error
    expect(currentInput).toHaveValue('wrongpass');
    expect(newInput).toHaveValue('newsecret2026');
    expect(confirmInput).toHaveValue('newsecret2026');
  });

  it('never stores passwords in localStorage', async () => {
    const mockUpdatePassword = vi.fn().mockResolvedValue(undefined);

    render(
      <SettingsView
        currentUserEmail="admin@manojkc1.com.np"
        isDjangoAuth={true}
        onUpdatePassword={mockUpdatePassword}
        onShowToast={vi.fn()}
        allData={dummyAllData}
        onImportAllData={vi.fn()}
      />
    );

    const currentInput = screen.getByPlaceholderText(/enter your current passphrase/i);
    const newInput = screen.getByPlaceholderText(/at least 6 characters/i);
    const confirmInput = screen.getByPlaceholderText(/repeat new passphrase/i);
    const submitBtn = screen.getByRole('button', { name: /update passphrase/i });

    fireEvent.change(currentInput, { target: { value: 'secretCurrentPass' } });
    fireEvent.change(newInput, { target: { value: 'secretNewPass2026' } });
    fireEvent.change(confirmInput, { target: { value: 'secretNewPass2026' } });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(mockUpdatePassword).toHaveBeenCalledWith('secretCurrentPass', 'secretNewPass2026');
    });

    // Verify localStorage has no traces of passwords
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i) || '';
      const val = localStorage.getItem(key) || '';
      expect(val).not.toContain('secretCurrentPass');
      expect(val).not.toContain('secretNewPass2026');
      expect(key.toLowerCase()).not.toContain('password');
      expect(key.toLowerCase()).not.toContain('passphrase');
    }
  });
});

