import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { InquiriesView } from '../pages/admin/views/InquiriesView';
import type { AdminInquiry } from '../pages/admin/types';

describe('InquiriesView Component', () => {
  const mockInquiries: AdminInquiry[] = [
    {
      id: 'inq-1',
      name: 'Elena Rostova',
      email: 'elena@example.com',
      company: 'Vertex AI',
      phone: '+977 9851011111',
      hasWhatsApp: true,
      scopeTitle: 'Full-Stack Microservices in Django',
      budgetRange: 'US$2,500–5,000',
      timeline: '2–3 Months',
      message: 'Looking for a skilled backend architect.',
      submittedAt: '10/4/2026, 12:00:00 PM',
      status: 'New',
      read: false,
      replied: false,
      projectId: 'agritech',
      projectTitle: 'Agritech Marketplace',
    },
    {
      id: 'inq-2',
      name: 'Devendra Shrestha',
      email: 'devendra@example.com',
      company: 'FinTech Nepal',
      phone: '+977 9851022222',
      hasWhatsApp: true,
      scopeTitle: 'PostgreSQL Audit',
      budgetRange: 'NPR 200,000–400,000',
      timeline: '1 Month',
      message: 'Database query optimization needed.',
      submittedAt: '10/3/2026, 09:30:00 AM',
      status: 'In Progress',
      read: true,
      replied: true,
      projectId: 'calcpro',
      projectTitle: 'CalcPro',
    },
  ];

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('renders all inquiries and KPI metrics correctly', () => {
    render(
      <InquiriesView
        inquiries={mockInquiries}
        onUpdateInquiries={vi.fn()}
        onDeleteInquiry={vi.fn()}
        onShowToast={vi.fn()}
        onRefresh={vi.fn()}
      />
    );

    expect(screen.getByText(/Project Inquiries & Lead Inbox/i)).toBeInTheDocument();
    expect(screen.getByText('Elena Rostova')).toBeInTheDocument();
    expect(screen.getByText('Devendra Shrestha')).toBeInTheDocument();
    expect(screen.getByText('elena@example.com')).toBeInTheDocument();
    expect(screen.getByText('devendra@example.com')).toBeInTheDocument();

    // Total Leads KPI card
    expect(screen.getByText('Total Leads')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
  });

  it('filters inquiries by search query', () => {
    render(
      <InquiriesView
        inquiries={mockInquiries}
        onUpdateInquiries={vi.fn()}
        onDeleteInquiry={vi.fn()}
        onShowToast={vi.fn()}
      />
    );

    const searchInput = screen.getByPlaceholderText(/search inquiries/i);
    fireEvent.change(searchInput, { target: { value: 'PostgreSQL' } });

    expect(screen.queryByText('Elena Rostova')).not.toBeInTheDocument();
    expect(screen.getByText('Devendra Shrestha')).toBeInTheDocument();
  });

  it('filters inquiries by status dropdown', () => {
    render(
      <InquiriesView
        inquiries={mockInquiries}
        onUpdateInquiries={vi.fn()}
        onDeleteInquiry={vi.fn()}
        onShowToast={vi.fn()}
      />
    );

    const statusDropdown = screen.getByDisplayValue(/All Inquiries/i);
    fireEvent.change(statusDropdown, { target: { value: 'In Progress' } });

    expect(screen.queryByText('Elena Rostova')).not.toBeInTheDocument();
    expect(screen.getByText('Devendra Shrestha')).toBeInTheDocument();
  });

  it('triggers onUpdateInquiries when changing status dropdown', () => {
    const onUpdateMock = vi.fn();
    const onToastMock = vi.fn();

    render(
      <InquiriesView
        inquiries={mockInquiries}
        onUpdateInquiries={onUpdateMock}
        onShowToast={onToastMock}
      />
    );

    const statusSelects = screen.getAllByRole('combobox');
    // Find the row status select for Elena (first inquiry)
    const elenaStatusSelect = statusSelects.find((s) => (s as HTMLSelectElement).value === 'New');
    expect(elenaStatusSelect).toBeDefined();

    if (elenaStatusSelect) {
      fireEvent.change(elenaStatusSelect, { target: { value: 'Won' } });
      expect(onUpdateMock).toHaveBeenCalledTimes(1);
      const updatedList = onUpdateMock.mock.calls[0][0];
      expect(updatedList[0].status).toBe('Won');
      expect(updatedList[0].read).toBe(true);
      expect(onToastMock).toHaveBeenCalledWith(expect.stringContaining('Won'));
    }
  });

  it('opens delete confirmation modal and executes delete', async () => {
    const onUpdateMock = vi.fn();
    const onDeleteMock = vi.fn();
    const onToastMock = vi.fn();

    render(
      <InquiriesView
        inquiries={mockInquiries}
        onUpdateInquiries={onUpdateMock}
        onDeleteInquiry={onDeleteMock}
        onShowToast={onToastMock}
      />
    );

    const deleteButtons = screen.getAllByTitle(/Delete inquiry/i);
    fireEvent.click(deleteButtons[0]);

    expect(screen.getByText(/Delete Client Inquiry\?/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Elena Rostova/i).length).toBeGreaterThanOrEqual(1);

    const confirmBtn = screen.getByRole('button', { name: /Yes, Permanently Delete/i });
    fireEvent.click(confirmBtn);

    expect(onUpdateMock).toHaveBeenCalledWith(
      expect.not.arrayContaining([expect.objectContaining({ id: 'inq-1' })])
    );
    await waitFor(() => {
      expect(onDeleteMock).toHaveBeenCalledWith('inq-1');
      expect(onToastMock).toHaveBeenCalledWith(expect.stringContaining('deleted successfully'));
    });
  });

  it('renders empty state when no inquiries match', () => {
    render(
      <InquiriesView
        inquiries={[]}
        onUpdateInquiries={vi.fn()}
        onShowToast={vi.fn()}
      />
    );

    expect(screen.getByText(/No matching inquiries found in lead inbox/i)).toBeInTheDocument();
  });

  it('triggers onRefresh when refresh button clicked', async () => {
    const onRefreshMock = vi.fn().mockResolvedValue(undefined);

    render(
      <InquiriesView
        inquiries={mockInquiries}
        onUpdateInquiries={vi.fn()}
        onRefresh={onRefreshMock}
        onShowToast={vi.fn()}
      />
    );

    const refreshBtn = screen.getByTitle(/Synchronize latest inquiries/i);
    fireEvent.click(refreshBtn);

    expect(onRefreshMock).toHaveBeenCalledTimes(1);
  });
});
