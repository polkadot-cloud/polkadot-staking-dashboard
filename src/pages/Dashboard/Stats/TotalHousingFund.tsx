// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useNetworkMetrics } from 'contexts/Network';
import { Text } from 'library/StatBoxList/Text';
import { useTranslation } from 'react-i18next';
import { humanNumberBn } from 'Utils';

const TotalHousingFund = () => {
  const { t } = useTranslation('pages');
  const { totalHousingFund, decimals } = useNetworkMetrics();

  const params = {
    label: t('dashboard.housingFund'),
    value: `$ ${humanNumberBn(totalHousingFund, decimals)}`,
  };
  return <Text {...params} />;
};

export default TotalHousingFund;
