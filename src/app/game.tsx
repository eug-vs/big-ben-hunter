'use client';

import { generateResult, exchangeHashes } from './generate';
import { useMutation } from '@tanstack/react-query';
import { generateRandomPair, getRandomValue } from '@/shared/randomUtils';
import { ShaTS } from 'sha256-ts';
import _ from 'lodash';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import Bitcoin from './bitcoin';

interface Props {
  streak: number;
}

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

export default function Game({ streak }: Props) {
  const router = useRouter();
  const [flippedId, setFlippedId] = useState<number>();
  const [isPending, startTransition] = useTransition();

  const {
    mutateAsync: handleFlip,
    data,
    isLoading: isFlipping,
  } = useMutation({
    mutationFn: flip,
    onMutate(id) {
      setFlippedId(id);
    },
    onSettled() {
      setFlippedId(undefined);
    },
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
          <div className="relative" key={id}>
            <button
              className={`
                relative w-28 transform-gpu transition
                ${
                  flippedId === id
                    ? 'flipped scale-110 duration-500'
                    : 'hover:rotate-[-25deg] hover:scale-110'
                }
              `}
              onClick={() => handleFlip(id)}
              disabled={isFlipping}
            >
              <Bitcoin />
            </button>
            {data?.guess === id && (
              <span
                className={`absolute right-4 mx-auto animate-fly-away text-2xl font-bold ${
                  data.result === id ? 'text-red-500' : ''
                }`}
              >
                {data.result === id
                  ? '-50%'
                  : `+${isPending ? streak + 1 : streak}`}
              </span>
            )}
          </div>
        ))}
      </section>
    </div>
  );
}
