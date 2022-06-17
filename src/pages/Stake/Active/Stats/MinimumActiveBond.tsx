// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useApi } from 'contexts/Api';
import { useStaking } from 'contexts/Staking';
import { Number } from 'library/StatBoxList/Number';
import { APIContextInterface } from 'types/api';
import { StakingContextInterface } from 'types/staking';

export const MinimumActiveBondStatBox = () => {
  const { network } = useApi() as APIContextInterface;
  const { eraStakers } = useStaking() as StakingContextInterface;
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
