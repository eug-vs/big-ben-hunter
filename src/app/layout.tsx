import { ClerkProvider, SignIn, SignedIn, SignedOut } from '@clerk/nextjs';
import './globals.css';
import { Inter } from 'next/font/google';
import ReactQueryProvider from './reactQueryProvider';

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
      <body className={inter.className}>
        <ClerkProvider>
          <SignedOut>
            <SignIn />
          </SignedOut>
          <SignedIn>
            <ReactQueryProvider>{children}</ReactQueryProvider>
          </SignedIn>
        </ClerkProvider>
      </body>
    </html>
  );
}
