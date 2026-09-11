import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ContactInbox } from './ContactInbox';
import * as contactService from '../../services/contact.service';

// Mock the CMS context
jest.mock('../../context/CMSContext', () => ({
  useCMS: () => ({
    messages: [
      {
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
        subject: 'Test Subject',
        message: 'Test message',
        ip: '192.168.1.1',
        country: 'United States',
        browser: 'Chrome',
        device: 'Desktop',
        status: 'Unread',
        starred: false,
        createdAt: '2024-01-01T00:00:00Z',
      },
    ],
    updateContactMessage: jest.fn(),
    deleteContactMessage: jest.fn(),
  }),
}));

// Mock the contact service
jest.mock('../../services/contact.service', () => ({
  contactService: {
    reply: jest.fn(),
  },
}));

describe('ContactInbox', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Reply submission', () => {
    it('should call contactService.reply with correct parameters', async () => {
      const mockReply = jest.fn().mockResolvedValue({
        success: true,
        data: { task_id: 'task-123' },
      });
      (contactService.contactService.reply as jest.Mock) = mockReply;

      render(<ContactInbox />);

      // Select the message
      const messageItem = screen.getByText('John Doe');
      fireEvent.click(messageItem);

      // Type reply
      const textarea = screen.getByPlaceholderText('Type your official response...');
      fireEvent.change(textarea, { target: { value: 'Test reply message' } });

      // Click send button
      const sendButton = screen.getByText('Send Email Reply');
      fireEvent.click(sendButton);

      await waitFor(() => {
        expect(mockReply).toHaveBeenCalledWith('1', { reply: 'Test reply message' });
      });
    });

    it('should show loading state while sending', async () => {
      const mockReply = jest.fn().mockImplementation(
        () => new Promise((resolve) => setTimeout(() => resolve({ success: true }), 100))
      );
      (contactService.contactService.reply as jest.Mock) = mockReply;

      render(<ContactInbox />);

      // Select the message
      const messageItem = screen.getByText('John Doe');
      fireEvent.click(messageItem);

      // Type reply
      const textarea = screen.getByPlaceholderText('Type your official response...');
      fireEvent.change(textarea, { target: { value: 'Test reply message' } });

      // Click send button
      const sendButton = screen.getByText('Send Email Reply');
      fireEvent.click(sendButton);

      // Check for loading state
      expect(screen.getByText('Sending...')).toBeInTheDocument();
    });

    it('should show success state after successful submission', async () => {
      const mockReply = jest.fn().mockResolvedValue({
        success: true,
        data: { task_id: 'task-123' },
      });
      (contactService.contactService.reply as jest.Mock) = mockReply;

      render(<ContactInbox />);

      // Select the message
      const messageItem = screen.getByText('John Doe');
      fireEvent.click(messageItem);

      // Type reply
      const textarea = screen.getByPlaceholderText('Type your official response...');
      fireEvent.change(textarea, { target: { value: 'Test reply message' } });

      // Click send button
      const sendButton = screen.getByText('Send Email Reply');
      fireEvent.click(sendButton);

      await waitFor(() => {
        expect(screen.getByText('Reply queued for email delivery')).toBeInTheDocument();
      });
    });

    it('should show error state when API fails', async () => {
      const mockReply = jest.fn().mockResolvedValue({
        success: false,
        message: 'API Error',
      });
      (contactService.contactService.reply as jest.Mock) = mockReply;

      render(<ContactInbox />);

      // Select the message
      const messageItem = screen.getByText('John Doe');
      fireEvent.click(messageItem);

      // Type reply
      const textarea = screen.getByPlaceholderText('Type your official response...');
      fireEvent.change(textarea, { target: { value: 'Test reply message' } });

      // Click send button
      const sendButton = screen.getByText('Send Email Reply');
      fireEvent.click(sendButton);

      await waitFor(() => {
        expect(screen.getByText('API Error')).toBeInTheDocument();
      });
    });

    it('should show network error when API call throws', async () => {
      const mockReply = jest.fn().mockRejectedValue(new Error('Network error'));
      (contactService.contactService.reply as jest.Mock) = mockReply;

      render(<ContactInbox />);

      // Select the message
      const messageItem = screen.getByText('John Doe');
      fireEvent.click(messageItem);

      // Type reply
      const textarea = screen.getByPlaceholderText('Type your official response...');
      fireEvent.change(textarea, { target: { value: 'Test reply message' } });

      // Click send button
      const sendButton = screen.getByText('Send Email Reply');
      fireEvent.click(sendButton);

      await waitFor(() => {
        expect(screen.getByText('Network error. Please try again.')).toBeInTheDocument();
      });
    });
  });

  describe('Duplicate submission prevention', () => {
    it('should prevent duplicate submissions while sending', async () => {
      let resolvePromise: (value: any) => void;
      const mockReply = jest.fn().mockImplementation(
        () => new Promise((resolve) => {
          resolvePromise = resolve;
        })
      );
      (contactService.contactService.reply as jest.Mock) = mockReply;

      render(<ContactInbox />);

      // Select the message
      const messageItem = screen.getByText('John Doe');
      fireEvent.click(messageItem);

      // Type reply
      const textarea = screen.getByPlaceholderText('Type your official response...');
      fireEvent.change(textarea, { target: { value: 'Test reply message' } });

      // Click send button twice
      const sendButton = screen.getByText('Send Email Reply');
      fireEvent.click(sendButton);
      fireEvent.click(sendButton);

      // Should only call once
      await waitFor(() => {
        expect(mockReply).toHaveBeenCalledTimes(1);
      });

      // Resolve the promise
      resolvePromise!({ success: true });
    });

    it('should disable send button while sending', async () => {
      const mockReply = jest.fn().mockImplementation(
        () => new Promise((resolve) => setTimeout(() => resolve({ success: true }), 100))
      );
      (contactService.contactService.reply as jest.Mock) = mockReply;

      render(<ContactInbox />);

      // Select the message
      const messageItem = screen.getByText('John Doe');
      fireEvent.click(messageItem);

      // Type reply
      const textarea = screen.getByPlaceholderText('Type your official response...');
      fireEvent.change(textarea, { target: { value: 'Test reply message' } });

      // Click send button
      const sendButton = screen.getByText('Send Email Reply');
      fireEvent.click(sendButton);

      // Button should be disabled
      expect(sendButton).toBeDisabled();
    });

    it('should disable textarea while sending', async () => {
      const mockReply = jest.fn().mockImplementation(
        () => new Promise((resolve) => setTimeout(() => resolve({ success: true }), 100))
      );
      (contactService.contactService.reply as jest.Mock) = mockReply;

      render(<ContactInbox />);

      // Select the message
      const messageItem = screen.getByText('John Doe');
      fireEvent.click(messageItem);

      // Type reply
      const textarea = screen.getByPlaceholderText('Type your official response...') as HTMLTextAreaElement;
      fireEvent.change(textarea, { target: { value: 'Test reply message' } });

      // Click send button
      const sendButton = screen.getByText('Send Email Reply');
      fireEvent.click(sendButton);

      // Textarea should be disabled
      expect(textarea).toBeDisabled();
    });
  });

  describe('Form clearing', () => {
    it('should clear form after successful submission', async () => {
      const mockReply = jest.fn().mockResolvedValue({
        success: true,
        data: { task_id: 'task-123' },
      });
      (contactService.contactService.reply as jest.Mock) = mockReply;

      render(<ContactInbox />);

      // Select the message
      const messageItem = screen.getByText('John Doe');
      fireEvent.click(messageItem);

      // Type reply
      const textarea = screen.getByPlaceholderText('Type your official response...') as HTMLTextAreaElement;
      fireEvent.change(textarea, { target: { value: 'Test reply message' } });

      // Click send button
      const sendButton = screen.getByText('Send Email Reply');
      fireEvent.click(sendButton);

      await waitFor(() => {
        expect(textarea.value).toBe('');
      });
    });

    it('should not clear form on failed submission', async () => {
      const mockReply = jest.fn().mockResolvedValue({
        success: false,
        message: 'API Error',
      });
      (contactService.contactService.reply as jest.Mock) = mockReply;

      render(<ContactInbox />);

      // Select the message
      const messageItem = screen.getByText('John Doe');
      fireEvent.click(messageItem);

      // Type reply
      const textarea = screen.getByPlaceholderText('Type your official response...') as HTMLTextAreaElement;
      fireEvent.change(textarea, { target: { value: 'Test reply message' } });

      // Click send button
      const sendButton = screen.getByText('Send Email Reply');
      fireEvent.click(sendButton);

      await waitFor(() => {
        expect(textarea.value).toBe('Test reply message');
      });
    });
  });

  describe('Empty reply validation', () => {
    it('should not submit empty reply', async () => {
      const mockReply = jest.fn();
      (contactService.contactService.reply as jest.Mock) = mockReply;

      render(<ContactInbox />);

      // Select the message
      const messageItem = screen.getByText('John Doe');
      fireEvent.click(messageItem);

      // Click send button without typing
      const sendButton = screen.getByText('Send Email Reply');
      fireEvent.click(sendButton);

      // Should not call API
      expect(mockReply).not.toHaveBeenCalled();
    });

    it('should not submit whitespace-only reply', async () => {
      const mockReply = jest.fn();
      (contactService.contactService.reply as jest.Mock) = mockReply;

      render(<ContactInbox />);

      // Select the message
      const messageItem = screen.getByText('John Doe');
      fireEvent.click(messageItem);

      // Type whitespace
      const textarea = screen.getByPlaceholderText('Type your official response...');
      fireEvent.change(textarea, { target: { value: '   ' } });

      // Click send button
      const sendButton = screen.getByText('Send Email Reply');
      fireEvent.click(sendButton);

      // Should not call API
      expect(mockReply).not.toHaveBeenCalled();
    });
  });
});
