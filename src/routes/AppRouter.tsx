/**
 * src/routes/AppRouter.tsx
 *
 * Primary application router:
 * - Public routes: / (Portfolio), /login, /forgot-password
 * - Protected admin routes: /admin with full CMS layout and nested sub-pages
 * - AuthProvider and global Sonner Toaster integration
 */

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { AuthProvider } from '@/lib/auth/AuthProvider';
import { ProtectedRoute } from '@/lib/auth/ProtectedRoute';

// Public pages
import App from '@/App';
import LoginPage from '@/pages/LoginPage';
import ForgotPasswordPage from '@/pages/ForgotPasswordPage';

// Admin Shell & Pages
import AdminLayout from '@/components/admin/AdminLayout';
import DashboardPage from '@/pages/admin/DashboardPage';
import SecurityPage from '@/pages/admin/SecurityPage';
import SettingsPage from '@/pages/admin/SettingsPage';

// Admin Placeholders
import ProjectsPlaceholder from '@/pages/admin/ProjectsPlaceholder';
import ServicesPlaceholder from '@/pages/admin/ServicesPlaceholder';
import BlogPlaceholder from '@/pages/admin/BlogPlaceholder';
import InquiriesPlaceholder from '@/pages/admin/InquiriesPlaceholder';
import HomepagePlaceholder from '@/pages/admin/HomepagePlaceholder';
import AboutPlaceholder from '@/pages/admin/AboutPlaceholder';
import ServicesCatalogPlaceholder from '@/pages/admin/ServicesCatalogPlaceholder';
import ContactPlaceholder from '@/pages/admin/ContactPlaceholder';
import FooterPlaceholder from '@/pages/admin/FooterPlaceholder';
import LogoPlaceholder from '@/pages/admin/LogoPlaceholder';
import IdentityPlaceholder from '@/pages/admin/IdentityPlaceholder';
import SocialPlaceholder from '@/pages/admin/SocialPlaceholder';

export default function AppRouter() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Toaster richColors position="top-right" />
        <Routes>
          {/* Public Portfolio Route */}
          <Route path="/" element={<App />} />

          {/* Authentication Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />

          {/* Protected Admin Routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute requireRole="admin">
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<DashboardPage />} />
            <Route path="projects" element={<ProjectsPlaceholder />} />
            <Route path="services" element={<ServicesPlaceholder />} />
            <Route path="blog" element={<BlogPlaceholder />} />
            <Route path="inquiries" element={<InquiriesPlaceholder />} />
            <Route path="content/homepage" element={<HomepagePlaceholder />} />
            <Route path="content/about" element={<AboutPlaceholder />} />
            <Route path="content/services-catalog" element={<ServicesCatalogPlaceholder />} />
            <Route path="content/contact" element={<ContactPlaceholder />} />
            <Route path="content/footer" element={<FooterPlaceholder />} />
            <Route path="branding/logo" element={<LogoPlaceholder />} />
            <Route path="branding/identity" element={<IdentityPlaceholder />} />
            <Route path="branding/social" element={<SocialPlaceholder />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="security" element={<SecurityPage />} />
          </Route>

          {/* Fallback Catch-All */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
