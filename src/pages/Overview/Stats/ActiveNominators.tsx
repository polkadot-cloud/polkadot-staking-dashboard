// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import BN from 'bn.js';
import { useStaking } from 'contexts/Staking';
import { Pie } from 'library/StatBoxList/Pie';
import { useTranslation } from 'react-i18next';
import { toFixedIfNecessary } from 'Utils';

export const ActiveNominatorsStatBox = () => {
  const { eraStakers, staking } = useStaking();
  const { totalActiveNominators } = eraStakers;
  const { maxNominatorsCount } = staking;
  const { t } = useTranslation('pages');
  const maxNominatorsCountAsNumber = maxNominatorsCount.toNumber();

  // active nominators as percent
  let totalNominatorsAsPercent = 0;
  if (maxNominatorsCount.gt(new BN('0'))) {
    totalNominatorsAsPercent =
      totalActiveNominators / maxNominatorsCount.div(new BN(100)).toNumber();
  }

  const params = {
    label: t('overview.active_nominators'),
    stat: {
      value: totalActiveNominators,
      total: maxNominatorsCountAsNumber,
      unit: '',
    },
    graph: {
      value1: totalActiveNominators,
      value2: maxNominatorsCountAsNumber - totalActiveNominators,
    },
    tooltip: `${toFixedIfNecessary(totalNominatorsAsPercent, 2)}%`,
    helpKey: 'Active Nominators',
  };

  return <Pie {...params} />;
};

export default ActiveNominatorsStatBox;
