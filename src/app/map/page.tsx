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
    <Map data={flipStates} />
  )
}
