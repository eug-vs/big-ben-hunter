import { auth } from "@clerk/nextjs";
import Map from "./map";
import { prisma } from '@/server/db';

export default async function MapPage() {
  const { userId } = auth();
  if (!userId) throw new Error('Unauthorized');

  const { flipStates } = await prisma.playerAccount.findUniqueOrThrow({
    where: { userId },
    include: {
      flipStates: {
        select: {
          number: true,
          balance: true,
          streak: true,
        }
      },
    }
  });

  return (
    <div>
      <h1>Map 8========D</h1>
      <Map data={flipStates} />
    </div>
  )
}
