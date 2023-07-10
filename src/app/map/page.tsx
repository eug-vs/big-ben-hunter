import Map from './map';
import { prisma } from '@/server/db';
import { clerkClient } from '@clerk/nextjs';
import _ from 'lodash';

export default async function MapPage() {
  const data = await prisma.playerAccount.findMany({
    include: {
      flipStates: {
        orderBy: {
          number: 'desc',
        },
        take: 15,
        select: {
          number: true,
          balance: true,
          streak: true,
        },
      },
    },
  });
  const users = await clerkClient.users.getUserList({
    userId: data.map((acc) => acc.userId),
  });

  const dataWithNames = _.map(data, (account) => {
    const user = _.find(users, { id: account.userId });
    return {
      ...account,
      username:
        user?.username || `${user?.firstName || ''} ${user?.lastName || ''}`,
    };
  });

  return (
    <section className="bg-amber-50 rounded-lg shadow-xl">
      <h1 className="p-4 text-xl font-bold">Map 8====D</h1>
      <Map data={dataWithNames} />
    </section>
  )
}
