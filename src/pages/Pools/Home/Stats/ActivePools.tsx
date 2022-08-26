// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { usePoolsConfig } from 'contexts/Pools/PoolsConfig';
import { Number } from 'library/StatBoxList/Number';

const ActivePoolsStatBox = () => {
  const { stats } = usePoolsConfig();

  const params = {
    label: 'Active Pools',
    value: stats.counterForBondedPools.toNumber(),
    unit: '',
    assistant: {
      page: 'pools',
      key: 'Active Pools',
    },
  };
  return <Number {...params} />;
};

export default ActivePoolsStatBox;
