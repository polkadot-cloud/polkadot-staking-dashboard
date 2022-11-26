// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useActivePools } from 'contexts/Pools/ActivePools';
import { usePoolMemberships } from 'contexts/Pools/PoolMemberships';
import { Text } from 'library/StatBoxList/Text';
import { useTranslation } from 'react-i18next';

const PoolMembership = () => {
  const { membership } = usePoolMemberships();
  const { isOwner } = useActivePools();
  const { t } = useTranslation('pages');

  const params = {
    label: t('pools.pool_membership'),
    value:
      membership === null
        ? t('pools.not_in_pool')
        : isOwner()
        ? `${t('pools.owner_of_pool')} ${membership.poolId}`
        : `${t('pools.in_pool')} ${membership.poolId}`,
    unit: '',
    helpKey: 'Pool Membership',
  };
  return <Text {...params} />;
};

export default PoolMembership;
