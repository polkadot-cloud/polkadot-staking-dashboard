// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useApi } from '../../../../contexts/Api';
import { useStaking } from '../../../../contexts/Staking';
import { Number } from '../../../../library/StatBoxList/Number';

export const MinimumActiveBondStatBox = () => {
  const { network }: any = useApi();
  const { eraStakers } = useStaking();
  const { minActiveBond } = eraStakers;

  const params = {
    label: 'Minimum Active Bond',
    value: minActiveBond,
    unit: network.unit,
    assistant: {
      page: 'stake',
      key: 'Bonding',
    },
  };

  return <Number {...params} />;
};

export default MinimumActiveBondStatBox;
