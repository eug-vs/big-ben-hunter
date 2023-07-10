'use client';
import {
  AnimatedAxis, // any of these can be non-animated equivalents
  AnimatedGrid,
  AnimatedLineSeries,
  XYChart,
  GlyphSeries,
  AnimatedAreaSeries,
} from '@visx/xychart';

import { type FlipState } from '@prisma/client';
import _ from 'lodash';

interface Props {
  data: Pick<FlipState, 'balance' | 'number' | 'streak'>[];
}

function buildBestPath(maxBalance: number) {
  const data = [{ balance: 0, streak: 0 }];

  while ((_.last(data)?.balance || 0) < maxBalance) {
    const lastState = _.last(data);
    if (lastState) {
      data.push({
        streak: lastState.streak + 1,
        balance: lastState.balance + lastState.streak + 1,
      });
    }
  }
  return data;
}

export default function Map({ data }: Props) {
  const bestPath = buildBestPath(_.maxBy(data, 'balance')?.balance || 0);

  return (
    <section className="bg-white">
      <h1 className="text-xl font-bold p-4">Map 8====D</h1>
      <XYChart
        height={700}
        xScale={{ type: 'linear' }}
        yScale={{ type: 'linear' }}
      >
        <AnimatedGrid />
        <AnimatedAxis orientation="bottom" />
        <AnimatedAxis orientation="left" />
        <AnimatedAreaSeries
          dataKey="Best path"
          fillOpacity={0.07}
          data={bestPath}
          xAccessor={(state) => state.balance}
          yAccessor={(state) => state.streak}
        />
        <AnimatedLineSeries
          dataKey="Path"
          data={data}
          xAccessor={(state) => state.balance}
          yAccessor={(state) => state.streak}
        />
        <GlyphSeries
          dataKey="Glyphs"
          data={data}
          xAccessor={(state) => state.balance}
          yAccessor={(state) => state.streak}
        />
      </XYChart>
    </section>
  );
}
