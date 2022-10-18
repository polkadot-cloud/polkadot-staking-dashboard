// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useValidators } from 'contexts/Validators';
import { useTranslation } from 'react-i18next';
import { Text } from 'library/StatBoxList/Text';

export const AverageCommission = () => {
  const { avgCommission } = useValidators();
  const { t } = useTranslation('common');

  const params = {
    label: t('pages.validators.average_commission'),
    value: `${String(avgCommission)}%`,
    helpKey: 'Average Commission',
  };
  return <Text {...params} />;
};

export default AverageCommission;
