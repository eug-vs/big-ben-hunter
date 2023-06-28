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
  if (guess === result) {
    await prisma.playerAccount.update({
      where: { userId },
      data: {
        balance: {
          divide: 2,
        },
        streak: 0,
      },
    });
  } else {
    const { streak } = await prisma.playerAccount.findFirstOrThrow({
      where: { userId },
    });
    await prisma.playerAccount.update({
      where: { userId },
      data: {
        balance: {
          increment: streak + 1,
        },
        streak: {
          increment: 1,
        },
      },
    });
  }

  return { result, binaryString };
}
