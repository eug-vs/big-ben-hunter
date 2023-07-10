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

  return <Map data={dataWithNames} />;
}
