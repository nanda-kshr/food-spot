import { AuthProvider } from '@/context/AuthContext';
import { ThemeProvider } from '@/context/ThemeContext';
import "./globals.css";

import { ReactNode, Suspense } from 'react';

export const metadata = {
  title: 'FoodSpot',
  description: 'Experience the finest dining',
  icons: {
    icon: '/circle.png',
    apple: '/circle.png',
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="font-sans">
      <Suspense fallback={<div>Loading...</div>}>
        <ThemeProvider>
          <AuthProvider>{children}</AuthProvider>
        </ThemeProvider>
        </Suspense>
      </body>
    </html>
  );
}