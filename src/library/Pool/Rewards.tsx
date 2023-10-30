// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import BigNumber from 'bignumber.js';
import { useValidators } from 'contexts/Validators/ValidatorEntries';
import {
  TooltipTrigger,
  ValidatorPulseWrapper,
} from 'library/ListItem/Wrappers';
import { useTooltip } from 'contexts/Tooltip';
import { MaxEraRewardPointsEras } from 'consts';
import { useApi } from 'contexts/Api';
import {
  normaliseEraPoints,
  prefillEraPoints,
} from 'library/ValidatorList/ValidatorItem/Utils';
import type { AnyJson } from '@polkadot-cloud/react/types';
import { usePoolPerformance } from 'contexts/Pools/PoolPerformance';
import { useTranslation } from 'react-i18next';
import type { RewardProps, RewardsGraphProps } from './types';

export const Rewards = ({ address, displayFor = 'default' }: RewardProps) => {
  const { t } = useTranslation('library');
  const { isReady } = useApi();
  const { setTooltipTextAndOpen } = useTooltip();
  const { eraPointsBoundaries } = useValidators();
  const { poolRewardPoints, poolRewardPointsFetched } = usePoolPerformance();

  const eraRewardPoints = Object.fromEntries(
    Object.entries(poolRewardPoints[address] || {}).map(([k, v]: AnyJson) => [
      k,
      new BigNumber(v),
    ])
  );

  const high = eraPointsBoundaries?.high || new BigNumber(1);
  const normalisedPoints = normaliseEraPoints(eraRewardPoints, high);
  const prefilledPoints = prefillEraPoints(Object.values(normalisedPoints));

  const empty = Object.values(poolRewardPoints).length === 0;
  const syncing = !isReady || poolRewardPointsFetched !== 'synced';
  const tooltipText = `${MaxEraRewardPointsEras} ${t('dayPoolPerformance')}`;

  return (
    <ValidatorPulseWrapper className={displayFor}>
      {syncing && <div className="preload" />}
      <TooltipTrigger
        className="tooltip-trigger-element"
        data-tooltip-text={tooltipText}
        onMouseMove={() => setTooltipTextAndOpen(tooltipText)}
      />
      <RewardsGraph points={prefilledPoints} syncing={empty} />
    </ValidatorPulseWrapper>
  );
};

export const RewardsGraph = ({ points = [], syncing }: RewardsGraphProps) => {
  const totalSegments = points.length - 1;
  const vbWidth = 512;
  const vbHeight = 115;
  const xPadding = 5;
  const yPadding = 10;
  const xArea = vbWidth - 2 * xPadding;
  const yArea = vbHeight - 2 * yPadding;
  const xSegment = xArea / totalSegments;
  let xCursor = xPadding;

  const pointsCoords = points.map((point: number) => {
    const coord = {
      x: xCursor,
      y: vbHeight - yPadding - yArea * point,
      zero: point === 0,
    };
    xCursor += xSegment;
    return coord;
  });

  const lineCoords = [];
  for (let i = 0; i <= pointsCoords.length - 1; i++) {
    const startZero = pointsCoords[i].zero;
    const endZero = pointsCoords[i + 1]?.zero;

    lineCoords.push({
      x1: pointsCoords[i].x,
      y1: pointsCoords[i].y,
      x2: pointsCoords[i + 1]?.x || pointsCoords[i].x,
      y2: pointsCoords[i + 1]?.y || pointsCoords[i].y,
      zero: startZero && endZero,
    });
  }

  const barCoords = [];
  for (let i = 0; i <= pointsCoords.length - 1; i++) {
    barCoords.push({
      x1: pointsCoords[i].x,
      y1: vbHeight - yPadding,
      x2: pointsCoords[i].x,
      y2: pointsCoords[i]?.y,
    });
  }

  return (
    <svg
      width="100%"
      height="100%"
      viewBox={`0 0 ${vbWidth} ${vbHeight}`}
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
    >
      {!syncing &&
        [{ y1: vbHeight * 0.5, y2: vbHeight * 0.5 }].map(
          ({ y1, y2 }, index) => {
            return (
              <line
                key={`grid_coord_${index}`}
                strokeWidth="3.75"
                stroke="var(--grid-color-primary)"
                x1={0}
                y1={y1}
                x2={vbWidth}
                y2={y2}
                opacity={0.5}
              />
            );
          }
        )}

      {!syncing &&
        barCoords.map(({ x1, y1, x2, y2 }, index) => {
          return (
            <line
              key={`line_coord_${index}`}
              strokeWidth={5}
              opacity={1}
              stroke="var(--accent-color-tertiary)"
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
            />
          );
        })}

      {!syncing &&
        lineCoords.map(({ x1, y1, x2, y2, zero }, index) => {
          return (
            <line
              key={`line_coord_${index}`}
              strokeWidth={5}
              opacity={zero ? 0.5 : 1}
              stroke={
                zero
                  ? 'var(--text-color-tertiary)'
                  : 'var(--accent-color-secondary)'
              }
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
            />
          );
        })}
    </svg>
  );
};
