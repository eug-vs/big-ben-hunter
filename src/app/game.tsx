'use client';

import * as openpgp from 'openpgp';
import NumberGenerator from 'recoverable-random';
import { useEffect, useMemo, useState } from 'react';
import { generate } from './generate';

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
  console.log(JSON.parse(verified.data));

  const generator = new NumberGenerator(signed);
  const localResult = generator.random(0, 4);

  if (result !== localResult)
    throw new Error(
      `Result does not match: server suggested ${result}, but computed ${localResult} locally`
    );
}

export default function Game() {
  const [key, setKey] = useState<openpgp.Key>();
  // TODO: this should be handled on the server and stored in database
  const [totalFlips, setTotalFlips] = useState(0);

  const armoredPublicKey = useMemo(() => atob(process.env.NEXT_PUBLIC_PUBLIC_KEY || ''), []);

  useEffect(() => {
    openpgp
      .readKey({
        armoredKey: armoredPublicKey,
      })
      .then(setKey)
      .catch(console.log);
  }, [armoredPublicKey]);

  const handleFlip = async () => {
    if (!key) throw new Error('Missing public key!');
    const { signed, result } = await generate(totalFlips);
    setTotalFlips(totalFlips + 1);
    console.log({ signed, result });
    await verifyResult(key, { signed, result });
  };

  return (
    <div className="flex flex-col items-center">
      <h1>Total flips: {totalFlips}</h1>
      {key && (
        <button className="m-4 bg-red-500 p-2" onClick={handleFlip}>
          Click me
        </button>
      )}
    </div>
  );
}
