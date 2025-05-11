import { AuthProvider } from '@/context/AuthContext';
import { ThemeProvider } from '@/context/ThemeContext';
import "./globals.css";

import { ReactNode, Suspense } from 'react';

export const metadata = {
  title: 'FoodSpot - Affordable Restaurant Menu Creator',
  description: 'Create professional digital menus for your restaurant at budget-friendly prices. Enhance customer experience with beautiful, easy-to-update digital menus.',
  keywords: 'restaurant menu, digital menu, affordable menu creator, food menu, restaurant marketing, online menu, menu management, restaurant owners, budget-friendly, menu design',
  openGraph: {
    title: 'FoodSpot - Restaurant Menu Solutions',
    description: 'Professional digital menus for restaurants at budget-friendly prices',
    url: 'https://foodspot.site',
    siteName: 'FoodSpot',
    images: [
      {
        url: '/circle.png',
        width: 1200,
        height: 630,
        alt: 'FoodSpot Restaurant Menu Platform',
      }
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FoodSpot - Affordable Restaurant Menu Creator',
    description: 'Create professional digital menus at budget-friendly prices',
    images: ['/logo.png'],
  },
  robots: 'index, follow',
  themeColor: '#ffffff',
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