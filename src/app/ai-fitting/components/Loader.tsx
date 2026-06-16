import React from 'react';

export const Loader: React.FC = () => (
  <div className="flex flex-col items-center justify-center text-center text-[var(--text-secondary)]">
    <svg
      className="animate-spin h-12 w-12 text-[var(--accent-color)] mb-4"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      ></circle>
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      ></path>
    </svg>
    <p className="font-bold text-lg text-[var(--text-primary)]">AI가 이미지를 생성하고 있습니다...</p>
    <p className="text-xs md:text-sm mt-1 text-[var(--text-muted)] font-medium">잠시만 기다려주세요. 최대 1분 정도 소요될 수 있습니다.</p>
  </div>
);
