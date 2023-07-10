'use client';
import {
  AnimatedAxis,
  AnimatedGrid,
  Annotation,
  AnnotationCircleSubject,
  AnnotationLabel,
  AreaSeries,
  GlyphSeries,
  LineSeries,
  XYChart,
  buildChartTheme,
  defaultColors,
} from '@visx/xychart';

import { type FlipState, type PlayerAccount } from '@prisma/client';
import { GradientPurpleOrange } from '@visx/gradient';
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
    <XYChart
      height={height}
      xScale={{ type: 'linear' }}
      yScale={{ type: 'linear' }}
      theme={buildChartTheme({
        backgroundColor: '#f09ae9',
        colors: _.shuffle(defaultColors),
        gridColor: '#336d88',
        gridColorDark: '#1d1b38',
        svgLabelBig: { fill: '#1d1b38' },
        tickLength: 8,
      })}
    >
      <AnimatedGrid />
      <AnimatedAxis orientation="bottom" label="Balance" />
      <AnimatedAxis orientation="left" label="Streak" />
      <AreaSeries
        fill="url('#gradient')"
        dataKey="Best path"
        fillOpacity={0.1}
        data={bestPath}
        renderLine={false}
        xAccessor={(state) => state.balance}
        yAccessor={(state) => state.streak}
      />
      <GradientPurpleOrange id="gradient" />
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
          datum={_.maxBy(account.flipStates, 'number') || account.flipStates[0]}
        >
          <AnnotationLabel title={account.username} />
          <AnnotationCircleSubject />
        </Annotation>
      ))}
    </XYChart>
  );
}
