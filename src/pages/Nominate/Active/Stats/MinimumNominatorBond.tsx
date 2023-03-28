// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useApi } from 'contexts/Api';
import { useStaking } from 'contexts/Staking';
import { Number } from 'library/StatBoxList/Number';
import { useTranslation } from 'react-i18next';
import { planckToUnit } from 'Utils';

export const MinimumNominatorBondStat = () => {
  const { t } = useTranslation('pages');
  const { unit, units } = useApi().network;
  const { staking } = useStaking();
  const { minNominatorBond } = staking;

  const params = {
    label: t('nominate.minimumToNominate'),
    value: planckToUnit(minNominatorBond, units).toNumber(),
    unit: `${unit}`,
    helpKey: 'Bonding',
  };

  return <Number {...params} />;
};
