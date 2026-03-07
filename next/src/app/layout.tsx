import type { Metadata } from 'next';

import './globals.css';

export const metadata: Metadata = {
  title: 'Daily Hanja Study',
  description: 'Hanja study dataset viewer',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="min-h-screen bg-slate-950 text-slate-100">
        {children}
      </body>
    </html>
  );
}
