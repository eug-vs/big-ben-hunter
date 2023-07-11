import { getOrCreatePlayerAccount } from '../header';
import Shop from './shop';

export default async function ShopPage() {
  const account = await getOrCreatePlayerAccount();
  return <Shop playerId={account.id} balance={account.flipStates[0].balance} />;
}
