// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { planckToUnit, rmCommas } from '@polkadot-cloud/utils';
import BigNumber from 'bignumber.js';
import { useTranslation } from 'react-i18next';
import { useActivePools } from 'contexts/Pools/ActivePools';
import { CardHeaderWrapper, CardWrapper } from 'library/Card/Wrappers';
import { usePoolCommission } from 'library/Hooks/usePoolCommission';
import { StatsHead } from 'library/StatsHead';
import { useNetwork } from 'contexts/Network';
import { Announcements } from './Announcements';
import { Wrapper } from './Wrappers';

export const PoolStats = () => {
  const { t } = useTranslation('pages');
  const {
    networkData: { units, unit },
  } = useNetwork();
  const { selectedActivePool, selectedPoolMemberCount } = useActivePools();
  const { getCurrentCommission } = usePoolCommission();

  const { state, points } = selectedActivePool?.bondedPool || {};
  const currentCommission = getCurrentCommission(selectedActivePool?.id ?? 0);

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

  const items = [
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
      value: `${selectedPoolMemberCount}`,
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
        <StatsHead items={items} />
        <Announcements />
      </Wrapper>
    </CardWrapper>
  );
};
