// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { Text } from 'library/StatBoxList/Text';
import { useValidators } from 'contexts/Validators';
import { useTranslation } from 'react-i18next';

export const AverageCommission = () => {
  const { avgCommission } = useValidators();
  const { t } = useTranslation('common');

  const params = {
    label: t('pages.validators.average_commission'),
    value: `${String(avgCommission)}%`,
    helpKey: 'Average Commission',
    chelpKey: '平均佣金',
  };
  return <Text {...params} />;
};

export default AverageCommission;
