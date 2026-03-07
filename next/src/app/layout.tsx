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
    <html lang="ko" data-theme="fantasy">
      <body className="min-h-screen">
        {children}
      </body>
    </html>
  );
}
