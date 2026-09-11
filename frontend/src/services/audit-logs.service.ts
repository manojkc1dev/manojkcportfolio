import { api, ApiResponse } from './api';
import { AuditLog as FrontendAuditLog, UserRole } from '../types';

// Backend audit log interface (snake_case)
interface BackendAuditLog {
  id: string;
  user_email: string;
  user_role: string;
  action: string;
  module: string;
  details: string;
  ip_address: string;
  user_agent: string;
  created_at: string;
}

// Transform backend data to frontend format
function transformAuditLog(data: BackendAuditLog): FrontendAuditLog {
  return {
    id: data.id,
    userEmail: data.user_email,
    userRole: (data.user_role === 'Super Admin' || data.user_role === 'Admin' || data.user_role === 'Editor' || data.user_role === 'Content Manager'
      ? data.user_role
      : 'Content Manager') as UserRole,
    action: data.action as FrontendAuditLog['action'],
    module: data.module,
    details: data.details,
    ipAddress: data.ip_address,
    timestamp: data.created_at,
  };
}

// Audit logs service
export const auditLogsService = {
  // Get all audit logs
  getAll: async () => {
    const response = await api.get<BackendAuditLog[]>('/audit-logs/');
    if (response.success && response.data) {
      return {
        ...response,
        data: response.data.map(transformAuditLog) as FrontendAuditLog[],
      } as unknown as ApiResponse<FrontendAuditLog[]>;
    }
    return response as unknown as ApiResponse<FrontendAuditLog[]>;
  },

  // Get single audit log
  getById: async (id: string) => {
    const response = await api.get<BackendAuditLog>(`/audit-logs/${id}/`);
    if (response.success && response.data) {
      return {
        ...response,
        data: transformAuditLog(response.data) as FrontendAuditLog,
      } as unknown as ApiResponse<FrontendAuditLog>;
    }
    return response as unknown as ApiResponse<FrontendAuditLog>;
  },

  // Create audit log (typically created by backend, but available for manual entries)
  create: async (data: Partial<FrontendAuditLog>) => {
    const response = await api.post<BackendAuditLog>('/audit-logs/', data);
    if (response.success && response.data) {
      return {
        ...response,
        data: transformAuditLog(response.data) as FrontendAuditLog,
      } as unknown as ApiResponse<FrontendAuditLog>;
    }
    return response as unknown as ApiResponse<FrontendAuditLog>;
  },
};
