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
    label: t('pools.poolMembership'),
    value:
      membership === null
        ? t('pools.notInPool')
        : isOwner()
        ? `${t('pools.ownerOfPool')} ${membership.poolId}`
        : `${t('pools.inPool')} ${membership.poolId}`,
    unit: '',
    helpKey: 'Pool Membership',
  };
  return <Text {...params} />;
};

export default PoolMembership;
