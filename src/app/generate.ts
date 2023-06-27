'use server';
import * as openpgp from 'openpgp';
import NumberGenerator from 'recoverable-random';

export async function generate(timestamp: number) {
  const privateKeyProtected = await openpgp.readPrivateKey({
    armoredKey: atob(process.env.PRIVATE_KEY || ''),
  });

  const privateKey = await openpgp.decryptKey({
    privateKey: privateKeyProtected,
    passphrase: 'Secret11#',
  });

  const now = Date.now();

  if (timestamp > now) throw new Error('Timestamp can not be in the future');
  if (now - timestamp > 1000)
    throw new Error('Timestamp can not be more than 1000ms away');

  const message = timestamp.toString();

  console.log({ privateKey, message });

  const signed = await openpgp.sign({
    message: await openpgp.createCleartextMessage({ text: message }),
    signingKeys: privateKey,
  });

  const generator = new NumberGenerator(signed);
  const result = generator.random(0, 4);

  return { signed, result };
}
