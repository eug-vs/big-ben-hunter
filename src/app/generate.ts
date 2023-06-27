'use server';
import { auth } from '@clerk/nextjs';
import * as openpgp from 'openpgp';
import NumberGenerator from 'recoverable-random';

export async function generate(totalFlips: number) {
  const { userId } = auth();
  const privateKeyProtected = await openpgp.readPrivateKey({
    armoredKey: atob(process.env.PRIVATE_KEY || ''),
  });

  const privateKey = await openpgp.decryptKey({
    privateKey: privateKeyProtected,
    passphrase: 'Secret11#',
  });

  const message = JSON.stringify({ userId, totalFlips });

  console.log({ privateKey, message });

  const signed = await openpgp.sign({
    message: await openpgp.createCleartextMessage({ text: message }),
    signingKeys: privateKey,
  });

  const generator = new NumberGenerator(signed);
  const result = generator.random(0, 4);

  return { signed, result };
}
