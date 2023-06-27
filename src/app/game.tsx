'use client';

import { generateResult, exchangeHashes } from './generate';
import { useMutation } from '@tanstack/react-query';
import { generateRandomPair, getRandomValue } from '@/hooks/shared/randomUtils';
import { ShaTS } from 'sha256-ts';

async function agreeOnFairRandomNumber() {
  const { hash, binaryString } = generateRandomPair();

  const serverHash = await exchangeHashes(hash);
  const { result: serverResult, binaryString: serverBinaryString } =
    await generateResult(binaryString, serverHash);

  // Verify that server hash matches his number
  const expectedServerHash = ShaTS.sha256(serverBinaryString);
  if (expectedServerHash != serverHash)
    throw new Error('Server lied about hash');

  const result = getRandomValue(binaryString, serverBinaryString);
  if (result != serverResult) throw new Error('Result does not match');

  return result;
}

export default function Game() {
  const {
    mutateAsync: handleFlip,
    data,
    isLoading: isFlipping,
  } = useMutation({
    mutationFn: agreeOnFairRandomNumber,
  });

  return (
    <div className="flex flex-col items-center">
      <button
        className="m-4 bg-red-500 p-2 px-4"
        onClick={() => handleFlip()}
        disabled={isFlipping}
      >
        {isFlipping ? 'Flipping...' : 'Flip'}
      </button>
      {data !== undefined && <h1>Result: {data}</h1>}
    </div>
  );
}
