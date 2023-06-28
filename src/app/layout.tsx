import { ClerkProvider, SignIn, SignedIn, SignedOut } from '@clerk/nextjs';
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
      <body className={`${inter.className} bg-pattern min-h-screen flex flex-col`}>
        <ClerkProvider>
          <Header />
          <main className="flex-1 flex flex-col p-4">
            <SignedOut>
              <SignIn />
            </SignedOut>
            <SignedIn>
              <ReactQueryProvider>{children}</ReactQueryProvider>
            </SignedIn>
          </main>
        </ClerkProvider>
      </body>
    </html>
  );
}
