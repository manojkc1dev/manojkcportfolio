import React from 'react';

interface AtsScoreRadialProps {
  score: number; // 0-100
  size?: number;
}

export const AtsScoreRadial: React.FC<AtsScoreRadialProps> = ({ score, size = 160 }) => {
  const strokeWidth = 14;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const clampedScore = Math.min(100, Math.max(0, score));
  const strokeDashoffset = circumference - (clampedScore / 100) * circumference;

  let colorClass = '#10b981'; // emerald
  let label = 'ATS Optimal';

  if (clampedScore < 70) {
    colorClass = '#f43f5e'; // rose
    label = 'Needs Work';
  } else if (clampedScore < 85) {
    colorClass = '#f59e0b'; // amber
    label = 'Competitive';
  }

  return (
    <div
      className="flex flex-col items-center justify-center"
      role="img"
      aria-label={`ATS score ${clampedScore} out of 100. Rating: ${label}`}
    >
      <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="transform -rotate-90">
          {/* Background track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            className="text-neutral-100 dark:text-neutral-800"
            fill="transparent"
          />
          {/* Progress arc */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={colorClass}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            style={{ transition: 'stroke-dashoffset 0.8s ease' }}
          />
        </svg>

        {/* Center label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-3xl font-extrabold tracking-tight text-neutral-900 dark:text-white">
            {clampedScore}
          </span>
          <span className="text-[10px] uppercase font-bold tracking-wider text-neutral-400">
            out of 100
          </span>
        </div>
      </div>

      <div
        className="mt-2 text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full"
        style={{ color: colorClass, backgroundColor: `${colorClass}18` }}
      >
        {label}
      </div>
    </div>
  );
};
