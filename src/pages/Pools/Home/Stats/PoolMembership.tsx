// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useActivePools } from 'contexts/Pools/ActivePools';
import { usePoolMemberships } from 'contexts/Pools/PoolMemberships';
import { Text } from 'library/StatBoxList/Text';
import { useTranslation } from 'react-i18next';

export const PoolMembershipStat = () => {
  const { t } = useTranslation('pages');
  const { getActiveAccountPoolMembership } = usePoolMemberships();
  const { isOwner } = useActivePools();

  const params = {
    label: t('pools.poolMembership'),
    value:
      getActiveAccountPoolMembership() === null
        ? t('pools.notInPool')
        : isOwner()
        ? `${t('pools.ownerOfPool')} ${
            getActiveAccountPoolMembership()?.poolId
          }`
        : `${t('pools.inPool')} ${getActiveAccountPoolMembership()?.poolId}`,
    unit: '',
    helpKey: 'Pool Membership',
  };
  return <Text {...params} />;
};
