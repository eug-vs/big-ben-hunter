'use client';

import { generateResult, exchangeHashes } from './generate';
import { useMutation } from '@tanstack/react-query';
import { generateRandomPair, getRandomValue } from '@/shared/randomUtils';
import { ShaTS } from 'sha256-ts';
import _ from 'lodash';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import Bitcoin from './bitcoin';

async function flip(guess: number) {
  const { hash, binaryString } = generateRandomPair();

  const serverHash = await exchangeHashes(hash, guess);
  const { result: serverResult, binaryString: serverBinaryString } =
    await generateResult(binaryString, serverHash);

  // Verify that server hash matches his number
  const expectedServerHash = ShaTS.sha256(serverBinaryString);
  if (expectedServerHash != serverHash)
    throw new Error('Server lied about hash');

  const result = getRandomValue(binaryString, serverBinaryString);
  if (result != serverResult) throw new Error('Result does not match');

  return { guess, result };
}

export default function Game() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const {
    mutateAsync: handleFlip,
    data,
    isLoading: isFlipping,
  } = useMutation({
    mutationFn: flip,
    onSuccess() {
      startTransition(() => {
        router.refresh();
      });
    },
  });

  return (
    <div className="flex flex-1 flex-col items-center justify-center">
      <section className="flex w-8/12 justify-between">
        {_.times(4).map((id) => (
          <button
            key={id}
            className="w-28 transition hover:scale-110"
            onClick={() => handleFlip(id)}
            disabled={isFlipping}
          >
            <Bitcoin />
          </button>
        ))}
      </section>
      <section>
        {isFlipping && <h1>Flipping...</h1>}
        {data !== undefined && (
          <h1
            className={`${
              data.result !== data.guess ? 'text-green-500' : 'text-red-500'
            }`}
          >
            Result: {data.result}
            <br /> Guess: {data.guess}
          </h1>
        )}
      </section>
    </div>
  );
}
