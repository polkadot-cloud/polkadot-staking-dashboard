// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { greaterThanZero } from '@polkadot-cloud/utils';
import BigNumber from 'bignumber.js';
import { useTranslation } from 'react-i18next';
import { useStaking } from 'contexts/Staking';
import { Pie } from 'library/StatBoxList/Pie';

export const ActiveValidatorsStat = () => {
  const { t } = useTranslation('pages');
  const {
    staking: { validatorCount },
    eraStakers: { activeValidators },
  } = useStaking();

  // active validators as percent. Avoiding dividing by zero.
  let activeValidatorsAsPercent = new BigNumber(0);
  if (greaterThanZero(validatorCount)) {
    activeValidatorsAsPercent = new BigNumber(activeValidators).dividedBy(
      validatorCount.multipliedBy(0.01)
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
      value2: validatorCount.minus(activeValidators).toNumber(),
    },
    tooltip: `${activeValidatorsAsPercent.decimalPlaces(2).toFormat()}%`,
    helpKey: 'Active Validator',
  };

  return <Pie {...params} />;
};
