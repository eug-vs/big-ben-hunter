import fs from 'fs';
import Game from './game';

export default async function Home() {
  const armoredPublicKey = fs.readFileSync('public.key').toString()

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1 className="text-2xl">Big Ben Hunter</h1>
      <Game armoredPublicKey={armoredPublicKey} />
    </main>
  )
}
