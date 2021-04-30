import React, {useLayoutEffect, useRef, useState} from 'react';
import {useDebouncedCallback} from 'use-debounce';

import {SkipLink} from '../SkipLink';
import {StringLabelFormatter, NumberLabelFormatter} from '../../types';
import {TooltipContent} from '../TooltipContent';
import {getDefaultColor, uniqueId} from '../../utilities';

import {Chart} from './Chart';
import {Series, RenderTooltipContentData} from './types';

export interface StackedAreaChartProps {
  formatXAxisLabel?: StringLabelFormatter;
  formatYAxisLabel?: NumberLabelFormatter;
  renderTooltipContent?(data: RenderTooltipContentData): React.ReactNode;
  xAxisLabels: string[];
  series: Series[];
  opacity?: number;
  isAnimated?: boolean;
  skipLinkText?: string;
}

export function StackedAreaChart({
  xAxisLabels,
  series,
  formatXAxisLabel = (value) => value.toString(),
  formatYAxisLabel = (value) => value.toString(),
  renderTooltipContent,
  opacity = 1,
  isAnimated = false,
  skipLinkText,
}: StackedAreaChartProps) {
  const [chartDimensions, setChartDimensions] = useState<DOMRect | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const skipLinkAnchorId = useRef(uniqueId('stackedAreaChart'));

  const [updateDimensions] = useDebouncedCallback(() => {
    if (containerRef.current != null) {
      setChartDimensions(containerRef.current.getBoundingClientRect());
    }
  }, 100);

  useLayoutEffect(() => {
    if (containerRef.current != null) {
      setChartDimensions(containerRef.current.getBoundingClientRect());
    }

    const isServer = typeof window === 'undefined';

    if (!isServer) {
      window.addEventListener('resize', updateDimensions);
    }

    return () => {
      if (!isServer) {
        window.removeEventListener('resize', updateDimensions);
      }
    };
  }, [containerRef, updateDimensions]);

  if (series.length === 0) {
    return null;
  }

  function renderDefaultTooltipContent({
    title,
    data,
  }: RenderTooltipContentData) {
    const formattedData = data.map(({label, value, color}) => ({
      color,
      label,
      value: formatYAxisLabel(value),
    }));

    return <TooltipContent title={title} data={formattedData} />;
  }

  const seriesWithDefaults = series.map((series, index) => ({
    color: getDefaultColor(index),
    ...series,
  }));

  return (
    <React.Fragment>
      {skipLinkText == null || skipLinkText.length === 0 ? null : (
        <SkipLink anchorId={skipLinkAnchorId.current}>{skipLinkText}</SkipLink>
      )}
      <div style={{height: '100%', width: '100%'}} ref={containerRef}>
        {chartDimensions == null ? null : (
          <Chart
            xAxisLabels={xAxisLabels}
            series={seriesWithDefaults}
            formatXAxisLabel={formatXAxisLabel}
            formatYAxisLabel={formatYAxisLabel}
            dimensions={chartDimensions}
            renderTooltipContent={
              renderTooltipContent != null
                ? renderTooltipContent
                : renderDefaultTooltipContent
            }
            opacity={opacity}
            isAnimated={isAnimated}
          />
        )}
      </div>

      {skipLinkText == null || skipLinkText.length === 0 ? null : (
        <SkipLink.Anchor id={skipLinkAnchorId.current} />
      )}
    </React.Fragment>
  );
}
