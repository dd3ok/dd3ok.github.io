import React from 'react';
import type { Metadata, Viewport } from 'next';

const siteUrl = 'https://dd3ok.github.io';
const title = '입어보기+';
const description = '옷이 나한테 어울릴까? 사진을 업로드해 가상으로 입어보는 서비스';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title,
  description,
  alternates: {
    canonical: '/ai-fitting',
  },
  openGraph: {
    title,
    description,
    url: `${siteUrl}/ai-fitting`,
    siteName: 'dd3ok Portfolio',
    locale: 'ko_KR',
    type: 'website',
    images: [
      {
        url: '/image/aiimage.png',
        width: 1024,
        height: 1024,
        alt: '입어보기+ 미리보기 이미지',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
    images: ['/image/aiimage.png'],
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
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
