// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import BigNumber from 'bignumber.js';
import { useApi } from 'contexts/Api';
import { BarSegment } from 'library/BarChart/BarSegment';
import { LegendItem } from 'library/BarChart/LegendItem';
import { Bar, BarChartWrapper, Legend } from 'library/BarChart/Wrappers';
import { useTranslation } from 'react-i18next';
import { greaterThanZero } from 'Utils';
import { BondedChartProps } from '../../pages/Nominate/Active/types';

export const BondedChart = ({
  active,
  free,
  unlocking,
  unlocked,
  inactive,
}: BondedChartProps) => {
  const { t } = useTranslation('library');
  const {
    network: { unit },
  } = useApi();
  const totalUnlocking = unlocking.plus(unlocked);

  // graph percentages
  const graphTotal = active.plus(totalUnlocking).plus(free);
  const graphActive = greaterThanZero(active)
    ? active.dividedBy(graphTotal.multipliedBy(new BigNumber(0.01)))
    : new BigNumber(0);

  const graphUnlocking = greaterThanZero(totalUnlocking)
    ? totalUnlocking.dividedBy(graphTotal.multipliedBy(new BigNumber(0.01)))
    : new BigNumber(0);

  const graphFree = greaterThanZero(graphTotal)
    ? new BigNumber(100).minus(graphActive).minus(graphUnlocking)
    : new BigNumber(0);

  return (
    <>
      <BarChartWrapper
        lessPadding
        style={{ marginTop: '2rem', marginBottom: '2rem' }}
      >
        <Legend>
          {inactive ? (
            <LegendItem dataClass="d4" label={t('available')} />
          ) : (
            <>
              <LegendItem dataClass="d1" label={t('bonded')} />

              {greaterThanZero(totalUnlocking) ? (
                <LegendItem dataClass="d3" label={t('unlocking')} />
              ) : null}
              <LegendItem dataClass="d4" label={t('free')} />
            </>
          )}
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
            label={`${free.decimalPlaces(3).toFormat()} ${unit}`}
            forceShow={inactive}
          />
        </Bar>
      </BarChartWrapper>
    </>
  );
};
