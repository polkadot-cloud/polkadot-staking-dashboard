// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import BigNumber from 'bignumber.js';
import { useStaking } from 'contexts/Staking';
import { Pie } from 'library/StatBoxList/Pie';
import { useTranslation } from 'react-i18next';
import { greaterThanZero } from 'Utils';

export const ActiveValidatorsStat = () => {
  const { staking, eraStakers } = useStaking();
  const { validatorCount } = staking;
  const { activeValidators } = eraStakers;
  const { t } = useTranslation('pages');

  // active validators as percent. Avoiding dividing by zero.
  let activeValidatorsAsPercent = new BigNumber(0);
  if (greaterThanZero(validatorCount)) {
    activeValidatorsAsPercent = new BigNumber(activeValidators).dividedBy(
      validatorCount.multipliedBy(new BigNumber(0.01))
    );
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
    tooltip: `${activeValidatorsAsPercent.decimalPlaces(2).toFormat()}%`,
    helpKey: 'Active Validator',
  };

  return <Pie {...params} />;
};
