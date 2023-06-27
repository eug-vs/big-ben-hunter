'use server';
import {
  generateRandomPair,
  getRandomValue,
} from '@/hooks/shared/randomUtils';
import { ShaTS } from 'sha256-ts';

interface StoreItem {
  hash: string;
  clientHash: string;
  binaryString: string;
}

// TODO: use redis or some other ephemeral storage for this shit
const store: Record<string, StoreItem> = {};

// eslint-disable-next-line @typescript-eslint/require-await
export async function exchangeHashes(clientHash: string) {
  const { binaryString, hash } = generateRandomPair();

  store[hash] = {
    hash,
    binaryString,
    clientHash,
  };

  return hash;
}

// eslint-disable-next-line @typescript-eslint/require-await
export async function generateResult(
  clientBinaryString: string,
  hash: string
) {
  const storeItem = store[hash];
  if (!storeItem) throw new Error('Item not found in store');
  const { binaryString, clientHash } = storeItem;

  // Verify that client hash matches his number
  const expectedClientHash = ShaTS.sha256(clientBinaryString);
  if (expectedClientHash != clientHash)
    throw new Error('Client lied about hash');

  const result = getRandomValue(clientBinaryString, binaryString);
  // TODO: process the result

  return { result, binaryString };
}
