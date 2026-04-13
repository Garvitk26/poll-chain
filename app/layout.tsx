import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { PollProvider } from '@/lib/context/PollContext';
import { ToastProvider } from '@/lib/context/ToastContext';
import { ConfettiProvider } from '@/components/shared/Confetti';
import Toast from '@/components/shared/Toast';
import Navbar from '@/components/shared/Navbar';
import WalletStatusBar from '@/components/shared/WalletStatusBar';
import Footer from '@/components/shared/Footer';
import AuthProvider from '@/components/shared/AuthProvider';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const jetbrainsMono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-jetbrains-mono' });

export const metadata: Metadata = {
  title: 'Pollchain',
  description: 'Tamper-proof on-chain voting platform on Stellar',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${jetbrainsMono.variable} font-sans`}>
        {/* Ambient Blobs */}
        <div className="ambient-blobs">
          <div className="blob blob-1"></div>
          <div className="blob blob-2"></div>
          <div className="blob blob-3"></div>
        </div>
        
        <AuthProvider>
          <ToastProvider>
            <ConfettiProvider>
              <PollProvider>
                <div className="relative z-10 flex flex-col min-h-screen">
                  <WalletStatusBar />
                  <Navbar />
                  <main className="flex-grow">
                    {children}
                  </main>
                  <Footer />
                </div>
                <Toast />
              </PollProvider>
            </ConfettiProvider>
          </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
