// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useApi } from 'contexts/Api';
import { usePoolsConfig } from 'contexts/Pools/PoolsConfig';
import { Number } from 'library/StatBoxList/Number';
import { useTranslation } from 'react-i18next';
import { planckToUnit } from 'Utils';

const MinCreateBondStatBox = () => {
  const { network } = useApi();
  const { units } = network;
  const { stats } = usePoolsConfig();
  const { t } = useTranslation('pages');

  const params = {
    label: t('pools.minimumToCreatePool'),
    value: planckToUnit(stats.minCreateBond, units).toNumber(),
    unit: network.unit,
    helpKey: 'Minimum To Create Pool',
  };
  return <Number {...params} />;
};

export default MinCreateBondStatBox;
