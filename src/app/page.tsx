import Map from '@/components/map';
import Game from './game';
import { getOrCreatePlayerAccount } from './header';
import { auth } from '@clerk/nextjs';
import _ from 'lodash';

export default async function Home() {
  const { userId } = auth();
  if (!userId) throw new Error('Unauthorized');

  const playerAccount = await getOrCreatePlayerAccount();
  return (
    <>
      <Game streak={playerAccount.flipStates[0].streak} />
      {_.find(playerAccount.features, { feature: 'minimap' }) && (
        <div className="absolute bottom-12 left-12 w-96 bg-amber-50 rounded-lg shadow-lg border-2 border-black">
          <Map
            height={250}
            accountFilter={{ userId }}
            takeFlips={30}
            showUsernameAnnotation={false}
          />
        </div>
      )}
    </>
  );
}
