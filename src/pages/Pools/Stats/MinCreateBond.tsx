// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { usePools } from '../../../contexts/Pools';
import { Number } from '../../../library/StatBoxList/Number';
import { planckBnToUnit } from '../../../Utils';
import { useApi } from '../../../contexts/Api';
import { APIContextInterface } from '../../../types/api';

const MinCreateBondStatBox = () => {
  const { network } = useApi() as APIContextInterface;
  const { units } = network;
  const { stats } = usePools();

  const params = {
    label: 'Minimum Create Bond',
    value: planckBnToUnit(stats.minCreateBond, units),
    unit: network.unit,
    assistant: {
      page: 'pools',
      key: 'Minimum Create Bond',
    },
  };
  return <Number {...params} />;
};

export default MinCreateBondStatBox;
