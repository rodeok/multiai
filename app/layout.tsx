import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Providers } from './providers';
import { getSystemSettings } from '@/app/actions/admin';
import { MaintenanceAlert } from '@/components/chat/MaintenanceAlert';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'MultiModel AI - Master Every Model',
  description: 'Access GPT-4, Claude 3.5, and Llama 3 in one unified workspace',
  openGraph: {
    images: [
      {
        url: 'https://bolt.new/static/og_default.png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    images: [
      {
        url: 'https://bolt.new/static/og_default.png',
      },
    ],
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getSystemSettings();

  return (
    <html lang="en">
      <body className={inter.className} suppressHydrationWarning>
        <Providers>
          {settings?.maintenanceMode && <MaintenanceAlert />}
          <div className={settings?.maintenanceMode ? 'pt-16' : ''}>
            {children}
          </div>
        </Providers>
      </body>
    </html>
  );
}