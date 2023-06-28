import { prisma } from '@/server/db';
import { UserButton, auth } from '@clerk/nextjs';
import Link from 'next/link';
import { cache } from 'react';

export const getOrCreatePlayerAccount = cache(async () => {
  const { userId } = auth();
  if (!userId) throw new Error('Unauthorized');

  try {
    return await prisma.playerAccount.findFirstOrThrow({
      where: { userId },
    });
  } catch (e) {
    return prisma.playerAccount.create({
      data: { userId },
    });
  }
});

export default async function Header() {
  const playerAccount = await getOrCreatePlayerAccount();

  return (
    <header className="flex w-full items-center justify-between border-b-2 border-black bg-primary p-4 font-semibold uppercase shadow-xl">
      <div className="flex items-center gap-4">
        <div className="h-8 w-8">
          <UserButton />
        </div>
        <section>
          <h1>Balance: {playerAccount.balance}</h1>
          <h1>Streak: {playerAccount.streak}</h1>
        </section>
      </div>
      <div className="text-center font-bold">
        <h1 className="text-3xl">Big Ben Hunter</h1>
        <h2 className="text-md">Feel Benis in Yo Jopa</h2>
      </div>
      <nav className="flex gap-4 text-lg">
        <Link href="/">Play</Link>
        <Link href="/shop">Shop :DDD</Link>
      </nav>
    </header>
  );
}
