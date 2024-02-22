// Copyright 2024 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { planckToUnit, rmCommas } from '@polkadot-cloud/utils';
import BigNumber from 'bignumber.js';
import { useTranslation } from 'react-i18next';
import { useActivePool } from 'contexts/Pools/ActivePool';
import { CardHeaderWrapper, CardWrapper } from 'library/Card/Wrappers';
import { usePoolCommission } from 'hooks/usePoolCommission';
import { Header } from 'library/Announcements/Header';
import { useNetwork } from 'contexts/Network';
import { Announcements } from './Announcements';
import type { PoolStatLabel } from 'library/Announcements/types';
import { useOverlay } from '@polkadot-cloud/react/hooks';
import { Wrapper } from 'library/Announcements/Wrappers';

export const PoolStats = () => {
  const { t } = useTranslation('pages');
  const { openCanvas } = useOverlay().canvas;
  const {
    networkData: { units, unit },
  } = useNetwork();
  const { getCurrentCommission } = usePoolCommission();
  const { activePool, activePoolMemberCount } = useActivePool();

  const poolId = activePool?.id || 0;

  const { state, points } = activePool?.bondedPool || {};
  const currentCommission = getCurrentCommission(poolId);

  const bonded = planckToUnit(
    new BigNumber(points ? rmCommas(points) : 0),
    units
  )
    .decimalPlaces(3)
    .toFormat();

  let stateDisplay;
  switch (state) {
    case 'Blocked':
      stateDisplay = t('pools.locked');
      break;
    case 'Destroying':
      stateDisplay = t('pools.destroying');
      break;
    default:
      stateDisplay = t('pools.open');
      break;
  }

  const items: PoolStatLabel[] = [
    {
      label: t('pools.poolState'),
      value: stateDisplay,
    },
  ];

  if (currentCommission) {
    items.push({
      label: t('pools.poolCommission'),
      value: `${currentCommission}%`,
    });
  }

  items.push(
    {
      label: t('pools.poolMembers'),
      value: `${activePoolMemberCount}`,
      button: {
        text: t('pools.browseMembers'),
        onClick: () => {
          openCanvas({ key: 'PoolMembers', size: 'xl' });
        },
        disabled: activePoolMemberCount === 0,
      },
    },
    {
      label: t('pools.totalBonded'),
      value: `${bonded} ${unit}`,
    }
  );

  return (
    <CardWrapper style={{ boxShadow: 'var(--card-shadow-secondary)' }}>
      <CardHeaderWrapper $withMargin>
        <h3>{t('pools.poolStats')}</h3>
      </CardHeaderWrapper>
      <Wrapper>
        <Header items={items} />
        <Announcements />
      </Wrapper>
    </CardWrapper>
  );
};
