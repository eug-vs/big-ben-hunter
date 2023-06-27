import Game from './game';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center gap-20 p-24">
      <h1 className="text-2xl">Big Ben Hunter</h1>
      <Game />
    </main>
  );
}
