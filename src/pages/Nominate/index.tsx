// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useUi } from 'contexts/UI';

import { Active } from './Active';
import { Setup } from './Setup';
import { Wrapper } from './Wrappers';

export const Nominate = () => {
  const { onNominatorSetup } = useUi();

  return <Wrapper>{onNominatorSetup ? <Setup /> : <Active />}</Wrapper>;
};

export default Nominate;
