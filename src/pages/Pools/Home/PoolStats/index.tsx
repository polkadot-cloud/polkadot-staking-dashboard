// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { planckToUnit, rmCommas } from '@polkadotcloud/utils';
import BigNumber from 'bignumber.js';
import { useApi } from 'contexts/Api';
import { useActivePools } from 'contexts/Pools/ActivePools';
import { usePoolMembers } from 'contexts/Pools/PoolMembers';
import { CardHeaderWrapper, CardWrapper } from 'library/Card/Wrappers';
import { usePoolCommission } from 'library/Hooks/usePoolCommission';
import { StatsHead } from 'library/StatsHead';
import { useTranslation } from 'react-i18next';
import { Announcements } from './Announcements';
import { Wrapper } from './Wrappers';

export const PoolStats = () => {
  const { t } = useTranslation('pages');
  const { network } = useApi();
  const { selectedActivePool } = useActivePools();
  const { getMembersOfPool } = usePoolMembers();
  const { getCurrentCommission } = usePoolCommission(
    selectedActivePool?.id ?? 0
  );

  const { state, points } = selectedActivePool?.bondedPool || {};
  const poolMembers = getMembersOfPool(selectedActivePool?.id ?? 0);

  const currentCommission = getCurrentCommission() || 0;

  const bonded = planckToUnit(
    new BigNumber(points ? rmCommas(points) : 0),
    network.units
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
      value: poolMembers.length,
    },
    {
      label: t('pools.totalBonded'),
      value: `${bonded} ${network.unit}`,
    }
  );

  return (
    <CardWrapper style={{ boxShadow: 'var(--card-shadow-secondary)' }}>
      <CardHeaderWrapper>
        <h3>{t('pools.poolStats')}</h3>
      </CardHeaderWrapper>
      <Wrapper>
        <StatsHead items={items} />
        <Announcements />
      </Wrapper>
    </CardWrapper>
  );
};
