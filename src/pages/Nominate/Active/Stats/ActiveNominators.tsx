// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import BigNumber from 'bignumber.js';
import { useTranslation } from 'react-i18next';
import { useApi } from 'contexts/Api';
import { useStaking } from 'contexts/Staking';
import { Pie } from 'library/StatBoxList/Pie';

export const ActiveNominatorsStat = () => {
  const { t } = useTranslation('pages');
  const { consts } = useApi();
  const { maxElectingVoters } = consts;
  const { totalActiveNominators } = useStaking().eraStakers;

  // active nominators as percent
  let totalNominatorsAsPercent = 0;
  if (maxElectingVoters.isGreaterThan(0)) {
    totalNominatorsAsPercent =
      totalActiveNominators / maxElectingVoters.dividedBy(100).toNumber();
  }

  const params = {
    label: t('overview.activeNominators'),
    stat: {
      value: totalActiveNominators,
      total: maxElectingVoters.toNumber(),
      unit: '',
    },
    graph: {
      value1: totalActiveNominators,
      value2: maxElectingVoters.minus(totalActiveNominators).toNumber(),
    },
    tooltip: `${new BigNumber(totalNominatorsAsPercent)
      .decimalPlaces(2)
      .toFormat()}%`,
    helpKey: 'Active Nominators',
  };

  return <Pie {...params} />;
};
