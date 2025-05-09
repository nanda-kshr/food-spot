import { AuthProvider } from '@/context/AuthContext';
import "./globals.css";

import { ReactNode } from 'react';

export const metadata = {
  title: 'FoodSpot',
  description: 'Experience the finest dining with Le Gourmet',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="font-sans">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}