// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import BN from 'bn.js';
import { useStaking } from '../../../contexts/Staking';
import { Pie } from '../../../library/StatBoxList/Pie';

export const TotalNominatorsStatBox = () => {
  const { staking }: any = useStaking();
  const { totalNominators, maxNominatorsCount } = staking;

  // total active nominators as percent
  let totalNominatorsAsPercent = 0;
  if (maxNominatorsCount.gt(new BN(0))) {
    totalNominatorsAsPercent = totalNominators
      .div(maxNominatorsCount.div(new BN(100)))
      .toNumber();
  }

  const params = {
    label: 'Total Nominators',
    stat: {
      value: totalNominators.toNumber(),
      total: maxNominatorsCount,
      unit: '',
    },
    graph: {
      value1: totalNominators.toNumber(),
      value2: maxNominatorsCount.sub(totalNominators).toNumber(),
    },

    tooltip: `${totalNominatorsAsPercent.toFixed(2)}%`,
    assistant: {
      page: 'overview',
      key: 'Nominators',
    },
  };

  return <Pie {...params} />;
};

export default TotalNominatorsStatBox;
