// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useValidators } from 'contexts/Validators';
import { Text } from 'library/StatBoxList/Text';
import { useTranslation } from 'react-i18next';

export const AverageCommission = () => {
  const { avgCommission } = useValidators();
  const { t } = useTranslation('pages');

  const params = {
    label: t('validators.average_commission'),
    value: `${String(avgCommission)}%`,
    helpKey: 'Average Commission',
  };
  return <Text {...params} />;
};

export default AverageCommission;
