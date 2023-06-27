import NumberGenerator from "recoverable-random";
import { ShaTS } from "sha256-ts";

// Generates a random 256-bit number and it's hash
export function generateRandomPair() {
  let temp = '0b';
  for (let i = 0; i < 256; i++) {
    temp += Math.round(Math.random());
  }

  const binaryString = BigInt(temp).toString(2);
  const hash = ShaTS.sha256(binaryString);
  return { binaryString, hash };
}

// Use XOR of two large numbers as a seed for RNG
export function getRandomValue(clientBinaryString: string, serverBinaryString: string) {
  const serverBinary = BigInt(`0b${serverBinaryString}`);
  const clientBinary = BigInt(`0b${clientBinaryString}`);

  const bigSeed = serverBinary ^ clientBinary;
  const seed = bigSeed % BigInt(Number.MAX_VALUE);

  const generator = new NumberGenerator(Number(seed));

  return generator.random(0, 4);
}
