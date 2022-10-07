// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useActivePool } from 'contexts/Pools/ActivePool';
import { usePoolMemberships } from 'contexts/Pools/PoolMemberships';
import { Text } from 'library/StatBoxList/Text';
import { useTranslation } from 'react-i18next';

const PoolMembership = () => {
  const { membership } = usePoolMemberships();
  const { isOwner } = useActivePool();
  const { t } = useTranslation('common');

  const params = {
    label: t('pages.validators.pool_membership'),
    value:
      membership === null
        ? 'Not in Pool'
        : isOwner()
        ? `Owner of Pool ${membership.poolId}`
        : `In Pool ${membership.poolId}`,
    unit: '',
    helpKey: 'Pool Membership',
    chelpKey: '池成员资格',
  };
  return <Text {...params} />;
};

export default PoolMembership;
