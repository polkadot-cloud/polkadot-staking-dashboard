// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { usePools } from '../../../contexts/Pools';
import { Number } from '../../../library/StatBoxList/Number';

const ActivePoolsStatBox = () => {
  const { stats } = usePools();

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
