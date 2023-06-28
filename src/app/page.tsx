import { auth } from '@clerk/nextjs';
import Game from './game';
import { prisma } from '@/server/db';

async function getOrCreatePlayerAccount(userId: string) {
  try {
    return await prisma.playerAccount.findFirstOrThrow({
      where: { userId }
    })
  } catch (e) {
    return prisma.playerAccount.create({
      data: { userId }
    })
  }
}

export default async function Home() {
  const { userId } = auth();
  if (!userId) throw new Error('Unauthorized');

  const playerAccount = await getOrCreatePlayerAccount(userId);

  return (
    <main className="flex min-h-screen flex-col items-center gap-20 p-24">
      <h1 className="text-2xl font-bold">Big Ben Hunter</h1>
      <section>
        <h1>Balance: {playerAccount.balance}</h1>
        <h1>Streak: {playerAccount.streak}</h1>
      </section>
      <Game />
    </main>
  );
}
