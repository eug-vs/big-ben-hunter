'use server';
import { prisma } from '@/server/db';
import { generateRandomPair, getRandomValue } from '@/shared/randomUtils';
import { auth } from '@clerk/nextjs';
import { ShaTS } from 'sha256-ts';

interface StoreItem {
  hash: string;
  clientHash: string;
  binaryString: string;
  guess: number;
}

// TODO: use redis or some other ephemeral storage for this shit
const store: Record<string, StoreItem | undefined> = {};

// eslint-disable-next-line @typescript-eslint/require-await
export async function exchangeHashes(clientHash: string, guess: number) {
  const { binaryString, hash } = generateRandomPair();

  store[hash] = {
    hash,
    binaryString,
    clientHash,
    guess,
  };

  return hash;
}

// eslint-disable-next-line @typescript-eslint/require-await
export async function generateResult(clientBinaryString: string, hash: string) {
  'use server';
  const { userId } = auth();
  if (!userId) throw new Error('Unauthorized');

  const storeItem = store[hash];
  if (!storeItem) throw new Error('Item not found in store');
  const { binaryString, clientHash, guess } = storeItem;

  // Remove storeItem after it's no longer needed
  store[hash] = undefined;

  // Verify that client hash matches his number
  const expectedClientHash = ShaTS.sha256(clientBinaryString);
  if (expectedClientHash != clientHash)
    throw new Error('Client lied about hash');

  const result = getRandomValue(clientBinaryString, binaryString);

  // Process the result
  console.log({ result, guess });
  const account = await prisma.playerAccount.findUniqueOrThrow({
    where: { userId },
    include: {
      flipStates: {
        orderBy: {
          number: 'desc',
        },
        take: 1,
      }
    }
  });
  const flipState = account.flipStates[0];
  console.log(flipState);

  if (guess === result) {
    await prisma.flipState.create({
      data: {
        number: flipState.number + 1,
        balance: Math.floor(flipState.balance /  2),
        streak: 0,
        playerId: account.id,
      }
    })
  } else {
    await prisma.flipState.create({
      data: {
        number: account.flipStates[0]?.number + 1,
        balance: flipState.balance + flipState.streak + 1,
        streak: flipState.streak + 1,
        playerId: account.id,
      }
    })
  }

  return { result, binaryString };
}
