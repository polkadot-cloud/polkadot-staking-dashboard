// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { Number } from 'library/StatBoxList/Number';
import { planckBnToUnit } from 'Utils';
import { useApi } from 'contexts/Api';
import { APIContextInterface } from 'types/api';
import { usePoolsConfig } from 'contexts/Pools/Config';
import { PoolsConfigContextState } from 'types/pools';

const MinJoinBondStatBox = () => {
  const { network } = useApi() as APIContextInterface;
  const { units } = network;
  const { stats } = usePoolsConfig() as PoolsConfigContextState;

  const params = {
    label: 'Minimum Join Bond',
    value: planckBnToUnit(stats.minJoinBond, units),
    unit: network.unit,
    assistant: {
      page: 'pools',
      key: 'Minimum Join Bond',
    },
  };
  return <Number {...params} />;
};

export default MinJoinBondStatBox;
