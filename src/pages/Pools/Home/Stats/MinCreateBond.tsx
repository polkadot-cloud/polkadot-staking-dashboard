// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { Number } from 'library/StatBoxList/Number';
import { planckBnToUnit } from 'Utils';
import { useApi } from 'contexts/Api';
import { usePoolsConfig } from 'contexts/Pools/PoolsConfig';
import { useTranslation } from 'react-i18next';

const MinCreateBondStatBox = () => {
  const { network } = useApi();
  const { units } = network;
  const { stats } = usePoolsConfig();
  const { t } = useTranslation('common');

  const params = {
    label: t('pages.Pools.minimum-create_bond'),
    value: planckBnToUnit(stats.minCreateBond, units),
    unit: network.unit,
    helpKey: 'Minimum Create Bond',
    chelpKey: '最低建池质押金',
  };
  return <Number {...params} />;
};

export default MinCreateBondStatBox;
