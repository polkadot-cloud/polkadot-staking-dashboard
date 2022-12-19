// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useApi } from 'contexts/Api';
import { useStaking } from 'contexts/Staking';
import { Number } from 'library/StatBoxList/Number';
import { planckBnToUnit } from 'Utils';

export const MinimumNominatorBondStatBox = () => {
  const { unit, units } = useApi().network;
  const { staking } = useStaking();
  const { minNominatorBond } = staking;

  const params = {
    label: 'Minimum Nominate Bond',
    value: planckBnToUnit(minNominatorBond, units),
    unit: `${unit}`,
    helpKey: 'Bonding',
  };

  return <Number {...params} />;
};

export default MinimumNominatorBondStatBox;
