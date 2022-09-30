// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import BN from 'bn.js';
import { useStaking } from 'contexts/Staking';
import { useApi } from 'contexts/Api';
import { Pie } from 'library/StatBoxList/Pie';
import { toFixedIfNecessary } from 'Utils';
import { useTranslation } from 'react-i18next';

export const ActiveNominatorsStatBox = () => {
  const { consts } = useApi();
  const { maxElectingVoters } = consts;
  const { eraStakers } = useStaking();
  const { totalActiveNominators } = eraStakers;
  const { t } = useTranslation('common');

  // active nominators as percent
  let totalNominatorsAsPercent = 0;
  if (maxElectingVoters > 0) {
    totalNominatorsAsPercent =
      totalActiveNominators /
      new BN(maxElectingVoters).div(new BN(100)).toNumber();
  }

  const params = {
    label: t('pages.Overview.active_nominators'),
    stat: {
      value: totalActiveNominators,
      total: maxElectingVoters,
      unit: '',
    },
    graph: {
      value1: totalActiveNominators,
      value2: maxElectingVoters - totalActiveNominators,
    },
    tooltip: `${toFixedIfNecessary(totalNominatorsAsPercent, 2)}%`,
    helpKey: 'Active Nominators',
    chelpKey: '活跃提名人',
  };

  return <Pie {...params} />;
};

export default ActiveNominatorsStatBox;
