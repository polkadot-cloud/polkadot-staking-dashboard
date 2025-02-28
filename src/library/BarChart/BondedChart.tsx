// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { greaterThanZero } from '@polkadot-cloud/utils';
import BigNumber from 'bignumber.js';
import { useTranslation } from 'react-i18next';
import { BarSegment } from 'library/BarChart/BarSegment';
import { LegendItem } from 'library/BarChart/LegendItem';
import { Bar, BarChartWrapper, Legend } from 'library/BarChart/Wrappers';
import { useNetwork } from 'contexts/Network';
import type { BondedChartProps } from '../../pages/Nominate/Active/types';

export const BondedChart = ({
  active,
  free,
  unlocking,
  unlocked,
  inactive,
}: BondedChartProps) => {
  const { t } = useTranslation('library');
  const {
    networkData: { unit },
  } = useNetwork();
  const totalUnlocking = unlocking.plus(unlocked);

  const MinimumLowerBound = 0.5;
  const MinimumNoNZeroPercent = 13;

  // graph percentages
  const graphTotal = active.plus(totalUnlocking).plus(free);

  const graphActive = greaterThanZero(active)
    ? BigNumber.max(
        active.dividedBy(graphTotal.multipliedBy(0.01)),
        active.isGreaterThan(MinimumLowerBound) ? MinimumNoNZeroPercent : 0
      )
    : new BigNumber(0);

  const graphUnlocking = greaterThanZero(totalUnlocking)
    ? BigNumber.max(
        totalUnlocking.dividedBy(graphTotal.multipliedBy(0.01)),
        totalUnlocking.isGreaterThan(MinimumLowerBound)
          ? MinimumNoNZeroPercent
          : 0
      )
    : new BigNumber(0);

  const freeToBond = free.decimalPlaces(3);
  const remaining = new BigNumber(100).minus(graphActive).minus(graphUnlocking);

  const graphFree = greaterThanZero(remaining)
    ? BigNumber.max(
        remaining,
        freeToBond.isGreaterThan(MinimumLowerBound) ? MinimumNoNZeroPercent : 0
      )
    : new BigNumber(0);

  return (
    <BarChartWrapper
      $lessPadding
      style={{ marginTop: '2rem', marginBottom: '2rem' }}
    >
      <Legend>
        {totalUnlocking.plus(active).isZero() ? (
          <LegendItem dataClass="d4" label={t('available')} />
        ) : greaterThanZero(active) ? (
          <LegendItem dataClass="d1" label={t('bonded')} />
        ) : null}

        {greaterThanZero(totalUnlocking) ? (
          <LegendItem dataClass="d3" label={t('unlocking')} />
        ) : null}

        {greaterThanZero(totalUnlocking.plus(active)) ? (
          <LegendItem dataClass="d4" label={t('free')} />
        ) : null}
      </Legend>
      <Bar>
        <BarSegment
          dataClass="d1"
          widthPercent={Number(graphActive.toFixed(2))}
          flexGrow={0}
          label={`${active.decimalPlaces(3).toFormat()} ${unit}`}
        />
        <BarSegment
          dataClass="d3"
          widthPercent={Number(graphUnlocking.toFixed(2))}
          flexGrow={0}
          label={`${totalUnlocking.decimalPlaces(3).toFormat()} ${unit}`}
        />
        <BarSegment
          dataClass="d4"
          widthPercent={Number(graphFree.toFixed(2))}
          flexGrow={0}
          label={`${freeToBond.toFormat()} ${unit}`}
          forceShow={inactive && totalUnlocking.isZero()}
        />
      </Bar>
    </BarChartWrapper>
  );
};
