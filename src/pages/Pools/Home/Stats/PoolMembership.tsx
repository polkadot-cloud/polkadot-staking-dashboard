// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useActivePools } from 'contexts/Pools/ActivePools';
import { usePoolMemberships } from 'contexts/Pools/PoolMemberships';
import { Text } from 'library/StatBoxList/Text';

const PoolMembership = () => {
  const { membership } = usePoolMemberships();
  const { isOwner } = useActivePools();

  const params = {
    label: 'Pool Membership',
    value:
      membership === null
        ? 'Not in Pool'
        : isOwner()
        ? `Owner of Pool ${membership.poolId}`
        : `In Pool ${membership.poolId}`,
    unit: '',
    helpKey: 'Pool Membership',
  };
  return <Text {...params} />;
};

export default PoolMembership;
