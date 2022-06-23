// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { usePoolsConfig } from 'contexts/Pools/PoolsConfig';
import { Number } from 'library/StatBoxList/Number';
import { PoolsConfigContextState } from 'types/pools';

const ActivePoolsStatBox = () => {
  const { stats } = usePoolsConfig() as PoolsConfigContextState;

  const params = {
    label: 'Active Pools',
    value: stats.counterForBondedPools.toNumber(),
    unit: '',
    assistant: {
      page: 'pools',
      key: 'Nomination Pools',
    },
  };
  return <Number {...params} />;
};

export default ActivePoolsStatBox;
