// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useValidators } from 'contexts/Validators/ValidatorEntries';
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
