'use client';
import {
  AnimatedAxis, // any of these can be non-animated equivalents
  AnimatedGrid,
  AnimatedLineSeries,
  XYChart,
  GlyphSeries,
} from '@visx/xychart';

import { type FlipState } from '@prisma/client';
import _ from 'lodash';

interface Props {
  data: Pick<FlipState, 'balance' | 'number' | 'streak'>[];
}

export default function Map({ data }: Props) {
  return (
    <section className="bg-white">
      <XYChart
        height={600}
        xScale={{ type: 'linear' }}
        yScale={{ type: 'linear' }}
      >
        <AnimatedGrid />
        <AnimatedAxis orientation="bottom" />
        <AnimatedAxis orientation="left" />
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
