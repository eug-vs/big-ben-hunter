import Game from './game';
import { getOrCreatePlayerAccount } from './header';

export default async function Home() {
  const playerAccount = await getOrCreatePlayerAccount();
  return <Game streak={playerAccount.streak} />;
}
