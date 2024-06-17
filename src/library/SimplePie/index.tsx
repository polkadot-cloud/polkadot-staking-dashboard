// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only
import { useState, useEffect, useMemo } from 'react';

export interface SimplePieProps {
  diameter: number;
  items: { value: number; color: string }[];
  innerRadius?: number;
  speed?: number;
}

const PROGRESS_TIMEOUT = 5;

const getArcPath = (
  start: number,
  end: number,
  innerRadius: number,
  outerRadius: number
) => {
  const startAngle = start * Math.PI * 2;
  const endAngle = end * Math.PI * 2;
  const x1 = innerRadius * Math.sin(startAngle);
  const y1 = innerRadius * -Math.cos(startAngle);
  const x2 = outerRadius * Math.sin(startAngle);
  const y2 = outerRadius * -Math.cos(startAngle);
  const x3 = outerRadius * Math.sin(endAngle);
  const y3 = outerRadius * -Math.cos(endAngle);
  const x4 = innerRadius * Math.sin(endAngle);
  const y4 = innerRadius * -Math.cos(endAngle);
  const bigArc = end - start >= 0.5;
  const outerFlags = bigArc ? '1 1 1' : '0 0 1';
  const innerFlags = bigArc ? '1 1 0' : '1 0 0';
  return `M ${x1},${y1} L ${x2},${y2} A ${outerRadius} ${outerRadius} ${outerFlags} ${x3},${y3}
        L ${x4},${y4} A ${innerRadius} ${innerRadius} ${innerFlags} ${x1},${y1} Z`;
};

export const SimplePie = ({
  diameter,
  items,
  innerRadius = 0,
  speed = 1,
}: SimplePieProps) => {
  const [visiblePart, setVisiblePart] = useState(0);
  const [rad] = useState(diameter / 2);

  const segments = useMemo(() => {
    // eslint-disable-next-line @typescript-eslint/no-shadow
    const sum = items.reduce((sum, item) => sum + item.value, 0);

    if (sum === 0) {
      // Hardcoded "inactive" radius - "dead state" - where all values sum to 0;
      return [
        {
          color: 'var(--background-default)',
          path: `M 0 0 L 0 -${rad} A ${rad} ${rad} 1 1 1 -0.1 -${rad} L 0 0 A 0 0 1 1 0 0 0 Z`,
        },
      ];
    }

    let start = 0;
    const filtered_items = items.filter((item) => item.value !== 0);
    return filtered_items.map((item) => {
      const p = sum * (1 / 1000);
      if (item.value === sum) {
        item.value = sum - p;
      }
      const delta = (item.value / sum) * visiblePart;
      const path = getArcPath(start, start + delta, innerRadius, rad);
      start += delta;
      return { ...item, path };
    });
  }, [items, innerRadius, rad, visiblePart]);

  useEffect(() => {
    if (visiblePart < 1) {
      setTimeout(
        () => setVisiblePart(visiblePart + speed / 100),
        PROGRESS_TIMEOUT
      );
    }
  }, [visiblePart]);

  return (
    <svg width={diameter} height={diameter} style={{ overflow: 'initial' }}>
      <g transform={`translate(${rad},${rad})`}>
        {segments.map((segment) => (
          <path
            key={segment.color}
            stroke={segment.color}
            fill={segment.color}
            d={segment.path}
          />
        ))}
      </g>
    </svg>
  );
};
