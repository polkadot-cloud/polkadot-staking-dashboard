// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import BN from 'bn.js';
import { useStaking } from 'contexts/Staking';
import { Pie } from 'library/StatBoxList/Pie';
import { useTranslation } from 'react-i18next';
import { toFixedIfNecessary } from 'Utils';

export const TotalNominatorsStatBox = () => {
  const { staking } = useStaking();
  const { totalNominators, maxNominatorsCount } = staking;
  const { t } = useTranslation('pages');

  // total active nominators as percent
  let totalNominatorsAsPercent = 0;
  if (maxNominatorsCount.gt(new BN(0))) {
    totalNominatorsAsPercent = totalNominators
      .div(maxNominatorsCount.div(new BN(100)))
      .toNumber();
  }

  const params = {
    label: t('overview.total_nominators'),
    stat: {
      value: totalNominators.toNumber(),
      total: maxNominatorsCount.toNumber(),
      unit: '',
    },
    graph: {
      value1: totalNominators.toNumber(),
      value2: maxNominatorsCount.sub(totalNominators).toNumber(),
    },

    tooltip: `${toFixedIfNecessary(totalNominatorsAsPercent, 2)}%`,
    helpKey: 'Total Nominators',
  };

  return <Pie {...params} />;
};

export default TotalNominatorsStatBox;
