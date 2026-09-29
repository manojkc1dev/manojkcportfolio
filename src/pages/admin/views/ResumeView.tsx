import React from 'react';
import { ResumeAdminPage } from '../../../components/admin/resume/ResumeAdminPage';
import type { Profile } from '../../../types';

interface ResumeViewProps {
  onShowToast: (message: string) => void;
  profile?: Profile;
  onUpdateProfile?: (profile: Profile) => void;
}

export const ResumeView: React.FC<ResumeViewProps> = ({
  onShowToast,
  profile,
}) => {
  return (
    <ResumeAdminPage
      onShowToast={onShowToast}
      adminEmail={profile?.email || 'manojkc1dev@gmail.com'}
    />
  );
};
