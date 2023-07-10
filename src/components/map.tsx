import ClientMap from './clientMap';
import { prisma } from '@/server/db';
import { clerkClient } from '@clerk/nextjs';
import { type Prisma } from '@prisma/client';
import _ from 'lodash';

interface Props {
  height?: number;
  showUsernameAnnotation?: boolean;
  accountFilter?: Prisma.PlayerAccountWhereInput;
  takeFlips?: number;
}

export default async function Map({
  height,
  accountFilter,
  showUsernameAnnotation,
  takeFlips = 15,
}: Props) {
  const data = await prisma.playerAccount.findMany({
    where: accountFilter,
    include: {
      flipStates: {
        orderBy: {
          number: 'desc',
        },
        take: takeFlips,
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
    <ClientMap
      data={dataWithNames}
      height={height}
      showUsernameAnnotation={showUsernameAnnotation}
    />
  );
}
