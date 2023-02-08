// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import BigNumber from 'bignumber.js';
import { useApi } from 'contexts/Api';
import { useStaking } from 'contexts/Staking';
import { Pie } from 'library/StatBoxList/Pie';
import { useTranslation } from 'react-i18next';

export const ActiveNominatorsStat = () => {
  const { t } = useTranslation('pages');
  const { consts } = useApi();
  const { maxElectingVoters } = consts;
  const { eraStakers } = useStaking();
  const { totalActiveNominators } = eraStakers;

  // active nominators as percent
  let totalNominatorsAsPercent = 0;
  if (maxElectingVoters.isGreaterThan(0)) {
    totalNominatorsAsPercent =
      totalActiveNominators /
      new BigNumber(maxElectingVoters).dividedBy(new BigNumber(100)).toNumber();
  }

  const params = {
    label: t('overview.activeNominators'),
    stat: {
      value: totalActiveNominators,
      total: maxElectingVoters,
      unit: '',
    },
    graph: {
      value1: totalActiveNominators,
      value2: maxElectingVoters.minus(totalActiveNominators),
    },
    tooltip: `${new BigNumber(totalNominatorsAsPercent)
      .decimalPlaces(2)
      .toFormat()}%`,
    helpKey: 'Active Nominators',
  };

  return <Pie {...params} />;
};
