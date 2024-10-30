// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { planckToUnit } from '@w3ux/utils';
import { useTranslation } from 'react-i18next';
import { Number } from 'library/StatBoxList/Number';
import { useNetwork } from 'contexts/Network';
import { useApi } from 'contexts/Api';
import BigNumber from 'bignumber.js';

export const MinimumNominatorBondStat = () => {
  const { t } = useTranslation('pages');
  const { unit, units } = useNetwork().networkData;
  const { minNominatorBond } = useApi().stakingMetrics;

  const params = {
    label: t('nominate.minimumToNominate'),
    value: new BigNumber(
      planckToUnit(minNominatorBond.toString(), units)
    ).toNumber(),
    decimals: 3,
    unit: `${unit}`,
    helpKey: 'Bonding',
  };

  return <Number {...params} />;
};
