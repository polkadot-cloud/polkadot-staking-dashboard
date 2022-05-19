// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import BN from 'bn.js';
import { useStaking } from '../../../contexts/Staking';
import { useApi } from '../../../contexts/Api';
import { Pie } from '../../../library/StatBoxList/Pie';

export const ActiveNominatorsStatBox = () => {
  const { consts }: any = useApi();
  const { maxElectingVoters } = consts;
  const { eraStakers }: any = useStaking();
  const { activeNominators } = eraStakers;

  // active nominators as percent
  let activeNominatorsAsPercent = 0;
  if (maxElectingVoters > 0) {
    activeNominatorsAsPercent = activeNominators / new BN(maxElectingVoters).div(new BN(100)).toNumber();
  }

  const params = {
    label: 'Active Nominators',
    stat: {
      value: activeNominators,
      total: maxElectingVoters,
      unit: '',
    },
    graph: {
      value1: activeNominators,
      value2: maxElectingVoters - activeNominators,
    },
    tooltip: `${activeNominatorsAsPercent.toFixed(2)}%`,
    assistant: {
      page: 'overview',
      key: 'Active Nominators',
    },
  };

  return <Pie {...params} />;
};

export default ActiveNominatorsStatBox;
