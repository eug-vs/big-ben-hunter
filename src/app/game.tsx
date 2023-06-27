'use client';

import * as openpgp from 'openpgp';
import NumberGenerator from 'recoverable-random';
import { useEffect, useState } from 'react';
import { generate } from './generate';

interface Props {
  armoredPublicKey: string;
}

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

export default function Game({ armoredPublicKey }: Props) {
  const [key, setKey] = useState<openpgp.Key>();

  useEffect(() => {
    openpgp
      .readKey({
        armoredKey: armoredPublicKey,
      })
      .then(setKey)
      .catch(console.log);
  }, [armoredPublicKey]);

  const handleClick = async () => {
    if (!key) throw new Error('Missing public key!');
    const { signed, result } = await generate(Date.now());
    console.log({ signed, result });
    await verifyResult(key, { signed, result });
  };

  return (
    <div>
      Game
      {key && (
        <button className="m-4 bg-red-500 p-2" onClick={handleClick}>
          Click me
        </button>
      )}
      <h1>Here is your public key</h1>
      <pre>{armoredPublicKey}</pre>
    </div>
  );
}
