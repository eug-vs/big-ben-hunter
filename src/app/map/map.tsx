'use client';
import {
  AnimatedAxis,
  AnimatedGrid,
  XYChart,
  GlyphSeries,
  LineSeries,
  AreaSeries,
  Annotation,
  AnnotationLabel,
  AnnotationCircleSubject,
  AnnotationConnector,
} from '@visx/xychart';

import { type PlayerAccount, type FlipState } from '@prisma/client';
import _ from 'lodash';

interface Props {
  data: (PlayerAccount & {
    username: string;
    flipStates: Pick<FlipState, 'balance' | 'number' | 'streak'>[];
  })[];
  height?: number;
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

export default function Map({ data, height = 700 }: Props) {
  const bestPath = buildBestPath(
    _.maxBy(
      data.flatMap((v) => v.flipStates),
      'balance'
    )?.balance || 0
  );

  return (
    <section className="bg-white">
      <h1 className="p-4 text-xl font-bold">Map 8====D</h1>
      <XYChart
        height={height}
        xScale={{ type: 'linear' }}
        yScale={{ type: 'linear' }}
      >
        <AnimatedGrid />
        <AnimatedAxis orientation="bottom" label="Balance" />
        <AnimatedAxis orientation="left" label="Streak" />
        <AreaSeries
          dataKey="Best path"
          fillOpacity={0.07}
          data={bestPath}
          xAccessor={(state) => state.balance}
          yAccessor={(state) => state.streak}
        />
        {data.map((account) => (
          <>
            <LineSeries
              dataKey={`Path: ${account.id}`}
              data={account.flipStates}
              xAccessor={(state) => state.balance}
              yAccessor={(state) => state.streak}
            />
            <GlyphSeries
              dataKey={`Glyphs: ${account.id} `}
              data={account.flipStates}
              xAccessor={(state) => state.balance}
              yAccessor={(state) => state.streak}
            />
          </>
        ))}
        {data.map((account) => (
          <Annotation
            key={account.id}
            dataKey={`Path: ${account.id}`}
            datum={
              _.maxBy(account.flipStates, 'number') || account.flipStates[0]
            }
          >
            <AnnotationLabel title={account.username} />
            <AnnotationCircleSubject />
          </Annotation>
        ))}
      </XYChart>
    </section>
  );
}
