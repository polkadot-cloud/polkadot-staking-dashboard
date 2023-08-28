// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { planckToUnit } from '@polkadot-cloud/utils';
import { useTranslation } from 'react-i18next';
import { useApi } from 'contexts/Api';
import { useStaking } from 'contexts/Staking';
import { Number } from 'library/StatBoxList/Number';

export const MinimumNominatorBondStat = () => {
  const { t } = useTranslation('pages');
  const { unit, units } = useApi().network;
  const { staking } = useStaking();
  const { minNominatorBond } = staking;

  const params = {
    label: t('nominate.minimumToNominate'),
    value: planckToUnit(minNominatorBond, units).toNumber(),
    decimals: 3,
    unit: `${unit}`,
    helpKey: 'Bonding',
  };

  return <Number {...params} />;
};
