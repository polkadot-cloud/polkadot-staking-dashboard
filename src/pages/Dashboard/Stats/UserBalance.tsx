// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useAccount } from 'contexts/Account';
import { useNetworkMetrics } from 'contexts/Network';
import { Text } from 'library/StatBoxList/Text';
import { useTranslation } from 'react-i18next';
import { humanNumberBn } from 'Utils';

const UserBalance = () => {
  const { t } = useTranslation('pages');
  const { decimals } = useNetworkMetrics();
  const { address, balance } = useAccount();

  const params = {
    label: t('dashboard.userBalance'),
    value: `$ ${humanNumberBn(balance, decimals)}`,
  };
  return address ? <Text {...params} /> : <></>;
};

export default UserBalance;
