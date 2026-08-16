import type { Metadata } from 'next';
import './globals.css';
import { Providers } from './providers';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AgeVerificationModal from '@/components/AgeVerificationModal';
import SecurityProvider from '@/components/SecurityProvider';

export const metadata: Metadata = {
  title: 'Szoniska',
  description: 'Dziel się szonami z innymi!',
  icons: {
    icon: '/logo.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pl">
      <body>
        <SecurityProvider>
          <Providers>
            <AgeVerificationModal />
            <Header />
            <main className="min-h-screen pt-28">
              {children}
            </main>
            <Footer />
          </Providers>
        </SecurityProvider>
      </body>

    </html>
  );
}
