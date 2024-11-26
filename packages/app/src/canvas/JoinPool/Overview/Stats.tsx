// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { rmCommas } from '@w3ux/utils';
import BigNumber from 'bignumber.js';
import { MaxEraRewardPointsEras } from 'consts';
import { useApi } from 'contexts/Api';
import { useNetwork } from 'contexts/Network';
import { usePoolPerformance } from 'contexts/Pools/PoolPerformance';
import { PoolSync } from 'library/PoolSync';
import { StyledLoader } from 'library/PoolSync/Loader';
import { planckToUnitBn } from 'library/Utils';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { CSSProperties } from 'styled-components';
import type { OverviewSectionProps } from '../types';
import { HeadingWrapper } from '../Wrappers';

export const Stats = ({
  bondedPool,
  performanceKey,
  graphSyncing,
}: OverviewSectionProps) => {
  const { t } = useTranslation('library');
  const {
    networkData: {
      units,
      unit,
      brand: { token: Token },
    },
  } = useNetwork();
  const { isReady, api } = useApi();
  const { getPoolRewardPoints } = usePoolPerformance();
  const poolRewardPoints = getPoolRewardPoints(performanceKey);
  const rawEraRewardPoints = Object.values(
    poolRewardPoints[bondedPool.addresses.stash] || {}
  );

  // Store the pool balance.
  const [poolBalance, setPoolBalance] = useState<BigNumber | null>(null);

  // Fetches the balance of the bonded pool.
  const getPoolBalance = async () => {
    if (!api) {
      return;
    }

    const balance = (
      await api.call.nominationPoolsApi.pointsToBalance(
        bondedPool.id,
        rmCommas(bondedPool.points)
      )
    ).toString();

    if (balance) {
      setPoolBalance(new BigNumber(balance));
    }
  };

  // Fetch the balance when pool or points change.
  useEffect(() => {
    if (isReady) {
      getPoolBalance();
    }
  }, [bondedPool.id, bondedPool.points, isReady]);

  const vars = {
    '--loader-color': 'var(--text-color-secondary)',
  } as CSSProperties;

  return (
    <HeadingWrapper>
      <h4>
        {graphSyncing ? (
          <span>
            {t('syncing')}
            <StyledLoader style={{ ...vars, marginRight: '1.25rem' }} />
            <PoolSync performanceKey={performanceKey} />
          </span>
        ) : (
          <>
            {rawEraRewardPoints.length === MaxEraRewardPointsEras && (
              <span className="active">{t('activelyNominating')}</span>
            )}

            <span className="balance">
              <Token className="icon" />
              {!poolBalance
                ? `...`
                : planckToUnitBn(poolBalance, units)
                    .decimalPlaces(3)
                    .toFormat()}{' '}
              {unit} {t('bonded')}
            </span>
          </>
        )}
      </h4>
    </HeadingWrapper>
  );
};
