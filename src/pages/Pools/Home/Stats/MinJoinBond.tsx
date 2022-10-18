// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useApi } from 'contexts/Api';
import { usePoolsConfig } from 'contexts/Pools/PoolsConfig';
import { useTranslation } from 'react-i18next';
import { Number } from 'library/StatBoxList/Number';
import { planckBnToUnit } from 'Utils';

const MinJoinBondStatBox = () => {
  const { network } = useApi();
  const { units } = network;
  const { stats } = usePoolsConfig();
  const { t } = useTranslation('common');

  const params = {
    label: t('pages.pools.minimum_join_bond'),
    value: planckBnToUnit(stats.minJoinBond, units),
    unit: network.unit,
    helpKey: 'Minimum Join Bond',
  };
  return <Number {...params} />;
};

export default MinJoinBondStatBox;
