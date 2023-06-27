'use client';

import { generateResult, exchangeHashes } from './generate';
import { useMutation } from '@tanstack/react-query';
import { generateRandomPair, getRandomValue } from '@/shared/randomUtils';
import { ShaTS } from 'sha256-ts';
import _ from 'lodash';
import { useState } from 'react';

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
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);

  const {
    mutateAsync: handleFlip,
    data,
    isLoading: isFlipping,
  } = useMutation({
    mutationFn: flip,
    onSuccess({ guess, result }) {
      if (guess === result) {
        setScore(Math.round(score / 2));
        setStreak(0);
      } else {
        setScore(score + streak);
        setStreak(streak + 1);
      }
    }
  });

  return (
    <div className="flex flex-col items-center gap-8">
      <section>
        <h1>Score: {score}</h1>
        <h1>Streak: {streak}</h1>
      </section>
      <section className="flex gap-4">
        {_.times(4).map((id) => (
          <button
            key={id}
            className="m-4 aspect-square whitespace-nowrap rounded-full bg-red-500 p-6"
            onClick={() => handleFlip(id)}
            disabled={isFlipping}
          >
            Flip {id}
          </button>
        ))}
      </section>
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
    </div>
  );
}
