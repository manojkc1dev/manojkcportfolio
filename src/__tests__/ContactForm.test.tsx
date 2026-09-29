import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Contact } from '../components/Contact';

// Mock Firebase as configured for contact form tests so fetch('/api/contact') is triggered
vi.mock('../firebase', () => ({
  isFirebaseConfigured: true,
  auth: null,
  db: null,
}));

describe('Contact Form Component', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('blocks submit when fields empty (shows validation errors)', async () => {
    render(<Contact />);
    const submitBtn = screen.getByRole('button', { name: /send message/i });

    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText(/enter your name/i)).toBeInTheDocument();
      expect(screen.getByText(/enter your email/i)).toBeInTheDocument();
      expect(screen.getByText(/enter a message/i)).toBeInTheDocument();
    });
  });

  it('rejects invalid email format', async () => {
    render(<Contact />);
    const nameInput = screen.getByLabelText(/your name/i);
    const emailInput = screen.getByLabelText(/email address/i);
    const messageInput = screen.getByLabelText(/message/i);
    const submitBtn = screen.getByRole('button', { name: /send message/i });

    fireEvent.change(nameInput, { target: { value: 'Alex Mercer' } });
    fireEvent.change(emailInput, { target: { value: 'not-an-email' } });
    fireEvent.change(messageInput, { target: { value: 'Hello, I have a backend opportunity!' } });

    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText(/valid email address/i)).toBeInTheDocument();
    });
  });

  it('accepts valid input and calls fetch once', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ success: true }),
    });
    global.fetch = fetchMock;

    render(<Contact />);
    const nameInput = screen.getByLabelText(/your name/i);
    const emailInput = screen.getByLabelText(/email address/i);
    const messageInput = screen.getByLabelText(/message/i);
    const submitBtn = screen.getByRole('button', { name: /send message/i });

    fireEvent.change(nameInput, { target: { value: 'Jane Doe' } });
    fireEvent.change(emailInput, { target: { value: 'jane@example.com' } });
    fireEvent.change(messageInput, { target: { value: 'Interested in discussing a Python Django backend contract.' } });

    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledTimes(1);
      expect(fetchMock).toHaveBeenCalledWith(
        '/api/contact',
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        })
      );
    });
  });

  it('shows success toast on { ok: true }', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ success: true }),
    });

    render(<Contact />);
    const nameInput = screen.getByLabelText(/your name/i);
    const emailInput = screen.getByLabelText(/email address/i);
    const messageInput = screen.getByLabelText(/message/i);
    const submitBtn = screen.getByRole('button', { name: /send message/i });

    fireEvent.change(nameInput, { target: { value: 'Jane Doe' } });
    fireEvent.change(emailInput, { target: { value: 'jane@example.com' } });
    fireEvent.change(messageInput, { target: { value: 'Interested in discussing a Python Django backend contract.' } });

    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText(/within 24 hours/i)).toBeInTheDocument();
    });
  });

  it('shows inline error on network failure', async () => {
    global.fetch = vi.fn().mockRejectedValue(new Error('Network connection failed'));

    render(<Contact />);
    const nameInput = screen.getByLabelText(/your name/i);
    const emailInput = screen.getByLabelText(/email address/i);
    const messageInput = screen.getByLabelText(/message/i);
    const submitBtn = screen.getByRole('button', { name: /send message/i });

    fireEvent.change(nameInput, { target: { value: 'Jane Doe' } });
    fireEvent.change(emailInput, { target: { value: 'jane@example.com' } });
    fireEvent.change(messageInput, { target: { value: 'Interested in discussing a Python Django backend contract.' } });

    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText(/Network connection failed/i)).toBeInTheDocument();
    });
  });
});
