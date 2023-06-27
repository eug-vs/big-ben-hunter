'use server';
import { generateRandomPair, getRandomValue } from '@/shared/randomUtils';
import { ShaTS } from 'sha256-ts';

interface StoreItem {
  hash: string;
  clientHash: string;
  binaryString: string;
  guess: number;
}

// TODO: use redis or some other ephemeral storage for this shit
const store: Record<string, StoreItem> = {};

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
  const storeItem = store[hash];
  if (!storeItem) throw new Error('Item not found in store');
  const { binaryString, clientHash, guess } = storeItem;

  // Verify that client hash matches his number
  const expectedClientHash = ShaTS.sha256(clientBinaryString);
  if (expectedClientHash != clientHash)
    throw new Error('Client lied about hash');

  const result = getRandomValue(clientBinaryString, binaryString);
  // TODO: process the result
  console.log({ result, guess });

  return { result, binaryString };
}
