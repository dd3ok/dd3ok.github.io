import React from 'react';
import type { Metadata, Viewport } from 'next';

export const metadata: Metadata = {
  title: '입어보기+',
  description: '옷이 나한테 어울릴까? 사진을 업로드해 가상으로 입어보는 서비스',
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