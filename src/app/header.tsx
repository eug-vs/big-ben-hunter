import Button from '@/components/button';
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
      include: {
        flipStates: {
          orderBy: {
            number: 'desc',
          },
          take: 1,
        },
        features: true,
      },
    });
  } catch (e) {
    return prisma.playerAccount.create({
      data: {
        userId,
        flipStates: {
          create: {
            number: 0,
          },
        },
      },
      include: {
        flipStates: {
          orderBy: {
            number: 'desc',
          },
          take: 1,
        },
        features: true,
      },
    });
  }
});

export default async function Header() {
  const playerAccount = await getOrCreatePlayerAccount().catch(() => null);

  return (
    <header className="grid w-full grid-cols-3 border-b-2 border-black bg-primary p-4 font-semibold uppercase shadow-xl">
      <div className="flex items-center gap-4">
        {playerAccount ? (
          <>
            <div className="h-8 w-8">
              <UserButton afterSignOutUrl="/" />
            </div>
            <section>
              <h1>Balance: {playerAccount.flipStates[0].balance}</h1>
              <h1>Streak: {playerAccount.flipStates[0].streak}</h1>
              <h1>Exp: {playerAccount.exp}</h1>
            </section>
          </>
        ) : (
          <Link href="/play">
            <Button>Sign in</Button>
          </Link>
        )}
      </div>
      <div className="flex justify-center items-center">
        <Link href="/" className="text-center font-bold">
          <h1 className="text-3xl">Big Ben Hunter</h1>
          <h2 className="text-md">Feel Benis in Yo Jopa</h2>
        </Link>
      </div>
      <nav className="flex justify-end items-center gap-4 text-lg">
        <Link href="/play">
          <Button>Play</Button>
        </Link>
        <Link href="/shop">
          <Button>Shop :DDD</Button>
        </Link>
        <Link href="/map">
          <Button>Map :D</Button>
        </Link>
      </nav>
    </header>
  );
}
