// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useStaking } from '../../../../contexts/Staking';
import { Pie } from '../../../../library/StatBoxList/Pie';

export const ActiveNominationsStatBox = () => {
  const { getNominationsStatus } = useStaking();
  const statuses = getNominationsStatus();

  const total = Object.values(statuses).length;
  const active =
    Object.values(statuses).filter((_v: any) => _v === 'active').length ?? 0;

  const params = {
    label: 'Active Nominations',
    stat: {
      value: active,
      total,
      unit: '',
    },
    graph: {
      value1: active,
      value2: active ? 0 : 1,
    },
    tooltip: `${active ? 'Active' : 'Inactive'}`,
    assistant: {
      page: 'stake',
      key: 'Nominations',
    },
  };

  return <Pie {...params} />;
};

export default ActiveNominationsStatBox;
