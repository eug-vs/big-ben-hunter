'use client';
import { useMutation } from '@tanstack/react-query';
import { buyExp, buyFeature, donate } from './actions';
import shopConfig from './shopConfig';
import { useTransition } from 'react';
import { useRouter } from 'next/navigation';

interface Props {
  playerId: string;
  balance: number;
}
export default function Shop({ playerId, balance }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const { mutateAsync: handleBuyFeature, isLoading: isBuying } = useMutation({
    mutationFn: buyFeature,
    onSuccess() {
      startTransition(() => {
        router.refresh();
      });
    },
  });

  const { mutateAsync: handleDonate, isLoading: isDonating } = useMutation({
    mutationFn: donate,
    onSuccess() {
      startTransition(() => {
        router.refresh();
      });
    },
  });

  const { mutateAsync: handleBuyExp, isLoading: isBuyingExp } = useMutation({
    mutationFn: buyExp,
    onSuccess() {
      startTransition(() => {
        router.refresh();
      });
    },
  });

  const isLoading = isDonating || isBuying || isBuyingExp || isPending;

  return (
    <section className="grid grid-cols-3 gap-10">
      <div className="flex justify-between rounded-md border-2 border-black bg-amber-50 p-4 shadow-lg">
        Donate :DDDDDDDD (10 BTC)
        <button
          className="text-lg font-bold disabled:text-gray-400"
          disabled={balance < 10 || isLoading}
          onClick={() => handleDonate({ playerId, amount: 10 })}
        >
          BUY
        </button>
      </div>
      <div className="flex justify-between rounded-md border-2 border-black bg-amber-50 p-4 shadow-lg">
        Buy some exp +{shopConfig.exp.amount} ({shopConfig.exp.price} BTC)
        <button
          className="text-lg font-bold disabled:text-gray-400"
          disabled={balance < shopConfig.exp.price || isLoading}
          onClick={() => handleBuyExp({ playerId })}
        >
          BUY
        </button>
      </div>
      <div className="flex justify-between rounded-md border-2 border-black bg-amber-50 p-4 shadow-lg">
        Minimap :DDD ({shopConfig.minimap.price} BTC)
        <button
          className="text-lg font-bold disabled:text-gray-400"
          disabled={balance < shopConfig.minimap.price || isLoading}
          onClick={() => handleBuyFeature({ playerId, feature: 'minimap' })}
        >
          BUY
        </button>
      </div>
    </section>
  );
}
