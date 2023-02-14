// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useNetworkMetrics } from 'contexts/Network';
import { Text } from 'library/StatBoxList/Text';
import { useTranslation } from 'react-i18next';
import { humanNumber } from 'Utils';

const TotalUsers = () => {
  const { t } = useTranslation('pages');
  const { totalUsers } = useNetworkMetrics();

  const params = {
    label: t('dashboard.totalUsers'),
    value: `${humanNumber(totalUsers)}`,
  };
  return <Text {...params} />;
};

export default TotalUsers;
