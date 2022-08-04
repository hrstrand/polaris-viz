import React from 'react';
import {DEFAULT_CHART_PROPS, ChartState} from '@shopify/polaris-viz-core';
import type {Dimensions, ChartProps} from '@shopify/polaris-viz-core';

import {ChartContainer} from '../ChartContainer';
import {ChartSkeleton} from '../';

import {Chart} from './Chart';

export type SparkBarChartProps = {
  dataOffsetRight?: number;
  dataOffsetLeft?: number;
  accessibilityLabel?: string;
  dimensions?: Dimensions;
} & ChartProps;

export function SparkBarChart(props: SparkBarChartProps) {
  const {
    data,
    accessibilityLabel,
    isAnimated,
    dataOffsetRight = 0,
    dataOffsetLeft = 0,
    theme,
    state,
    errorText,
  } = {
    ...DEFAULT_CHART_PROPS,
    ...props,
  };
  return (
    <ChartContainer
      data={data}
      theme={theme}
      sparkChart
      isAnimated={isAnimated}
    >
      {state !== ChartState.Success ? (
        <ChartSkeleton type="Spark" state={state} errorText={errorText} />
      ) : (
        <Chart
          data={data}
          dataOffsetRight={dataOffsetRight}
          dataOffsetLeft={dataOffsetLeft}
          accessibilityLabel={accessibilityLabel}
          theme={theme}
        />
      )}
    </ChartContainer>
  );
}
