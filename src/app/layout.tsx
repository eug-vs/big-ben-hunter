import { ClerkProvider } from '@clerk/nextjs';
import './globals.css';
import { Inter } from 'next/font/google';
import ReactQueryProvider from './reactQueryProvider';
import Header from './header';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Big Ben Hunter',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} flex min-h-screen flex-col bg-pattern`}
      >
        <ClerkProvider
          appearance={{
            variables: {
              colorPrimary: '#f59e0b',
              colorBackground: '#fffbeb',
              colorText: '#282828',
              colorInputBackground: '#F2E5BC',
            },
          }}
        >
          <Header />
          <main className="flex flex-1 flex-col p-6">
            <ReactQueryProvider>
              <audio loop autoPlay>
                <source src="/ost.ogg" />
              </audio>
              {children}
            </ReactQueryProvider>
          </main>
        </ClerkProvider>
      </body>
    </html>
  );
}
