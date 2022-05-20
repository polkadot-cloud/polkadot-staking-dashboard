// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { usePools } from '../../../contexts/Pools';
import { Number } from '../../../library/StatBoxList/Number';
import { planckBnToUnit } from '../../../Utils';
import { useApi } from '../../../contexts/Api';

const MinJoinBondStatBox = () => {
  const { network }: any = useApi();
  const { units } = network;
  const { stats } = usePools();

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
