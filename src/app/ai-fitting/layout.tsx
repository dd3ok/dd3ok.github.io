import React from 'react';

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