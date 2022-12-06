// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useStaking } from 'contexts/Staking';
import { Pie } from 'library/StatBoxList/Pie';
import { useTranslation } from 'react-i18next';

const ActiveValidatorsStatBox = () => {
  const { eraStakers } = useStaking();
  const { activeValidators } = eraStakers;
  const { t } = useTranslation('pages');

  const params = {
    label: t('validators.active_validators'),
    stat: {
      value: activeValidators,
      unit: '',
    },
    graph: {
      value1: activeValidators,
      value2: 0,
    },
    tooltip: `100%`,
    helpKey: 'Active Validator',
  };

  return <Pie {...params} />;
};

export default ActiveValidatorsStatBox;
