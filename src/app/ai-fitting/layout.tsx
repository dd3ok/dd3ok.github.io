import React from 'react';
import type { Metadata, Viewport } from 'next';

export const metadata: Metadata = {
  title: 'AI 가상 피팅룸',
  description: '인물 사진과 의류 사진을 업로드하여 AI가 옷을 입혀주는 가상 피팅 경험',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function AIFittingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-100">
      {children}
    </div>
  );
}