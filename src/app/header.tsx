import { prisma } from "@/server/db";
import { UserButton, auth } from "@clerk/nextjs";
import Link from "next/link";

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


export default async function Header() {
  const { userId } = auth();
  if (!userId) throw new Error('Unauthorized');

  const playerAccount = await getOrCreatePlayerAccount(userId);

  return (
    <header className="bg-primary w-full p-4 flex justify-between items-center">
      <div className="flex gap-4 items-center">
        <div className="w-8 h-8">
          <UserButton />
        </div>
        <section>
          <h1>Balance: {playerAccount.balance}</h1>
          <h1>Streak: {playerAccount.streak}</h1>
        </section>
      </div>
      <div className="text-center uppercase font-bold">
        <h1 className="text-3xl">
          Big Ben Hunter
        </h1>
        <h2 className="text-md">
          Feel Benis in Yo Jopa
        </h2>
      </div>
      <nav className="flex gap-4 text-lg">
        <Link href="/">
          Play
        </Link>
        <Link href="/shop">
          Shop :DDD
        </Link>
      </nav>
    </header>
  )
}
