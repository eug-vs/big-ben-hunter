'use client';

import * as openpgp from 'openpgp';
import NumberGenerator from 'recoverable-random';
import { useEffect, useMemo, useState } from 'react';
import { generate } from './generate';
import { getUnixTime } from 'date-fns';

async function verifyResult(
  key: openpgp.Key,
  { signed, result }: { signed: string; result: number }
) {
  const message = await openpgp.readCleartextMessage({
    cleartextMessage: signed,
  });

  const verified = await openpgp.verify({
    message,
    verificationKeys: key,
  });

  // TOOD: check verified
  console.log({ verified });

  const generator = new NumberGenerator(signed);
  const localResult = generator.random(0, 4);

  if (result !== localResult)
    throw new Error(
      `Result does not match: server suggested ${result}, but computed ${localResult} locally`
    );
}

export default function Game() {
  const [key, setKey] = useState<openpgp.Key>();
  const armoredPublicKey = useMemo(() => atob(process.env.NEXT_PUBLIC_PUBLIC_KEY || ''), []);

  useEffect(() => {
    console.log({ armoredPublicKey });
    openpgp
      .readKey({
        armoredKey: armoredPublicKey,
      })
      .then(setKey)
      .catch(console.log);
  }, [armoredPublicKey]);

  const handleClick = async () => {
    if (!key) throw new Error('Missing public key!');
    const { signed, result } = await generate(getUnixTime(new Date()));
    console.log({ signed, result });
    await verifyResult(key, { signed, result });
  };

  return (
    <div className="flex flex-col items-center">
      Game
      {key && (
        <button className="m-4 bg-red-500 p-2" onClick={handleClick}>
          Click me
        </button>
      )}
    </div>
  );
}
