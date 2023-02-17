// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useNetworkMetrics } from 'contexts/Network';
import { Text } from 'library/StatBoxList/Text';
import { useTranslation } from 'react-i18next';
import { humanNumber } from 'Utils';

const CurrentBlock = () => {
  const { t } = useTranslation('pages');
  const { blockNumber } = useNetworkMetrics();

  const params = {
    label: t('dashboard.blockNumber'),
    value: `${humanNumber(blockNumber)}`,
  };
  return <Text {...params} />;
};

export default CurrentBlock;
