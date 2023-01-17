// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import BigNumber from 'bignumber.js';
import { useStaking } from 'contexts/Staking';
import { Pie } from 'library/StatBoxList/Pie';
import { useTranslation } from 'react-i18next';
import { toFixedIfNecessary } from 'Utils';

const ActiveValidatorsStatBox = () => {
  const { staking, eraStakers } = useStaking();
  const { validatorCount } = staking;
  const { activeValidators } = eraStakers;
  const { t } = useTranslation('pages');

  // active validators as percent
  let activeValidatorsAsPercent = 0;
  if (validatorCount.isGreaterThan(new BigNumber(0))) {
    activeValidatorsAsPercent =
      activeValidators / (validatorCount.toNumber() * 0.01);
  }

  const params = {
    label: t('validators.activeValidators'),
    stat: {
      value: activeValidators,
      total: validatorCount.toNumber(),
      unit: '',
    },
    graph: {
      value1: activeValidators,
      value2: validatorCount.minus(new BigNumber(activeValidators)).toNumber(),
    },
    tooltip: `${toFixedIfNecessary(activeValidatorsAsPercent, 2)}%`,
    helpKey: 'Active Validator',
  };

  return <Pie {...params} />;
};

export default ActiveValidatorsStatBox;
