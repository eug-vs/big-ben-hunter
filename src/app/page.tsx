import Game from './game';

export default function Home() {
  const armoredPublicKey = atob(process.env.PUBLIC_KEY || '');

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1 className="text-2xl">Big Ben Hunter</h1>
      <Game armoredPublicKey={armoredPublicKey} />
    </main>
  );
}
