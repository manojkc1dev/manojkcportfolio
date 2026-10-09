import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Contact } from '../components/Contact';

describe('Contact Form Component', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    localStorage.clear();
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
    fireEvent.change(messageInput, {
      target: { value: 'Hello, I have a backend opportunity!' },
    });

    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText(/valid email address/i)).toBeInTheDocument();
    });
  });

  it('accepts valid input and calls the Django inquiry API once', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      text: async () =>
        JSON.stringify({
          status: 'ok',
          message: 'Your message has been received successfully.',
          id: 'test-inquiry-id',
        }),
    });

    global.fetch = fetchMock;

    render(<Contact />);

    const nameInput = screen.getByLabelText(/your name/i);
    const emailInput = screen.getByLabelText(/email address/i);
    const messageInput = screen.getByLabelText(/message/i);
    const submitBtn = screen.getByRole('button', { name: /send message/i });

    fireEvent.change(nameInput, { target: { value: 'Jane Doe' } });
    fireEvent.change(emailInput, { target: { value: 'jane@example.com' } });
    fireEvent.change(messageInput, {
      target: {
        value:
          'Interested in discussing a Python Django backend contract.',
      },
    });

    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledTimes(1);
    });

    expect(fetchMock).toHaveBeenCalledWith(
      'http://127.0.0.1:8000/api/v1/inquiries/',
      expect.objectContaining({
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      })
    );

    const [, requestOptions] = fetchMock.mock.calls[0];

    expect(JSON.parse(requestOptions.body)).toEqual({
      name: 'Jane Doe',
      email: 'jane@example.com',
      message:
        'Interested in discussing a Python Django backend contract.',
      sourcePage: 'http://localhost:3000/',
      hp_field: '',
      _hp: '',
    });
  });

  it('shows success toast on successful inquiry submission', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      text: async () =>
        JSON.stringify({
          status: 'ok',
          message: 'Your message has been received successfully.',
          id: 'test-inquiry-id',
        }),
    });

    render(<Contact />);

    const nameInput = screen.getByLabelText(/your name/i);
    const emailInput = screen.getByLabelText(/email address/i);
    const messageInput = screen.getByLabelText(/message/i);
    const submitBtn = screen.getByRole('button', { name: /send message/i });

    fireEvent.change(nameInput, { target: { value: 'Jane Doe' } });
    fireEvent.change(emailInput, { target: { value: 'jane@example.com' } });
    fireEvent.change(messageInput, {
      target: {
        value:
          'Interested in discussing a Python Django backend contract.',
      },
    });

    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText(/within 24 hours/i)).toBeInTheDocument();
    });
  });

  it('falls back to local persistence when the Django API is unavailable', async () => {
    global.fetch = vi
      .fn()
      .mockRejectedValue(new Error('Network connection failed'));

    render(<Contact />);

    const nameInput = screen.getByLabelText(/your name/i);
    const emailInput = screen.getByLabelText(/email address/i);
    const messageInput = screen.getByLabelText(/message/i);
    const submitBtn = screen.getByRole('button', { name: /send message/i });

    fireEvent.change(nameInput, { target: { value: 'Jane Doe' } });
    fireEvent.change(emailInput, { target: { value: 'jane@example.com' } });
    fireEvent.change(messageInput, {
      target: {
        value:
          'Interested in discussing a Python Django backend contract.',
      },
    });

    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText(/within 24 hours/i)).toBeInTheDocument();
    });

    expect(fetch).toHaveBeenCalledTimes(1);

    const portfolioInquiries = JSON.parse(
      localStorage.getItem('portfolio_inquiries') || '[]'
    );

    expect(portfolioInquiries).toHaveLength(1);
    expect(portfolioInquiries[0]).toMatchObject({
      name: 'Jane Doe',
      email: 'jane@example.com',
      message:
        'Interested in discussing a Python Django backend contract.',
      status: 'New',
      read: false,
      replied: false,
    });
  });
});
