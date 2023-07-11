'use server';
import { type Prisma } from '@prisma/client';
import { prisma } from '@/server/db';
import shopConfig from './shopConfig';

export async function buyFeature(data: Prisma.PlayerFeatureCreateArgs['data']) {
  'use server';
  const lastState = await prisma.flipState.findFirstOrThrow({
    where: { playerId: data.playerId },
    orderBy: {
      number: 'desc',
    },
  });
  if (lastState.balance < shopConfig[data.feature].price)
    throw new Error('Not enough BTC');
  await prisma.playerFeature.create({ data });
  await prisma.flipState.create({
    data: {
      balance: lastState.balance - shopConfig[data.feature].price,
      streak: lastState.streak,
      number: lastState.number + 1,
      playerId: lastState.playerId,
    },
  });
}

export async function donate({
  playerId,
  amount,
}: {
  playerId: string;
  amount: number;
}) {
  'use server';
  const lastState = await prisma.flipState.findFirstOrThrow({
    where: { playerId: playerId },
    orderBy: {
      number: 'desc',
    },
  });
  if (lastState.balance < amount) throw new Error('Not enough BTC');
  await prisma.flipState.create({
    data: {
      balance: lastState.balance - amount,
      streak: lastState.streak,
      number: lastState.number + 1,
      playerId: lastState.playerId,
    },
  });
}
