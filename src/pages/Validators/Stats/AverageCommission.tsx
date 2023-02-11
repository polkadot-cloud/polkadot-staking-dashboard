// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useValidators } from 'contexts/Validators';
import { Text } from 'library/StatBoxList/Text';
import { useTranslation } from 'react-i18next';

export const AverageCommissionStat = () => {
  const { t } = useTranslation('pages');
  const { avgCommission } = useValidators();

  const params = {
    label: t('validators.averageCommission'),
    value: `${String(avgCommission)}%`,
    helpKey: 'Average Commission',
  };
  return <Text {...params} />;
};
