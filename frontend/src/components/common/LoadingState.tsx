import React from 'react';
import { LoadingSpinner } from './LoadingSpinner';
import { SkeletonCard } from './SkeletonLoader';

interface LoadingStateProps {
  type?: 'spinner' | 'skeleton' | 'full-page';
  message?: string;
  className?: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  type = 'spinner',
  message = 'Loading...',
  className = '',
}) => {
  if (type === 'full-page') {
    return (
      <div className={`flex flex-col items-center justify-center min-h-screen bg-gray-50 ${className}`}>
        <LoadingSpinner size="lg" />
        <p className="mt-4 text-gray-600">{message}</p>
      </div>
    );
  }

  if (type === 'skeleton') {
    return (
      <div className={`space-y-4 ${className}`}>
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </div>
    );
  }

  return (
    <div className={`flex flex-col items-center justify-center py-8 ${className}`}>
      <LoadingSpinner size="md" />
      {message && <p className="mt-2 text-sm text-gray-600">{message}</p>}
    </div>
  );
};

export default LoadingState;
