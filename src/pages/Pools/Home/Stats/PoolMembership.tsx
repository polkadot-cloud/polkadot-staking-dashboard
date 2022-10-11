// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useActivePools } from 'contexts/Pools/ActivePools';
import { usePoolMemberships } from 'contexts/Pools/PoolMemberships';
import { Text } from 'library/StatBoxList/Text';
import { useTranslation } from 'react-i18next';

const PoolMembership = () => {
  const { membership } = usePoolMemberships();
  const { isOwner } = useActivePools();
  const { t } = useTranslation('common');

  const params = {
    label: t('pages.pools.pool_membership'),
    value:
      membership === null
        ? t('pages.pools.not_in_pool')
        : isOwner()
        ? `${t('pages.pools.owner_of_pool')} ${membership.poolId}`
        : `${t('pages.pools.in_pool')} ${membership.poolId}`,
    unit: '',
    helpKey: 'Pool Membership',
    chelpKey: '池成员资格',
  };
  return <Text {...params} />;
};

export default PoolMembership;
