// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { usePoolsConfig } from 'contexts/Pools/PoolsConfig';
import { Number } from 'library/StatBoxList/Number';
import { useTranslation } from 'react-i18next';

const ActivePoolsStatBox = () => {
  const { stats } = usePoolsConfig();
  const { t } = useTranslation('pages');

  const params = {
    label: t('pools.activePools'),
    value: stats.counterForBondedPools.toNumber(),
    unit: '',
    helpKey: 'Active Pools',
  };
  return <Number {...params} />;
};

export default ActivePoolsStatBox;
