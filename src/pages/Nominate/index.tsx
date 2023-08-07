// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useSetup } from 'contexts/Setup';
import { Active } from './Active';
import { Setup } from './Setup';
import { Wrapper } from './Wrappers';

export const Nominate = () => {
  const { onNominatorSetup } = useSetup();
  return <Wrapper>{onNominatorSetup ? <Setup /> : <Active />}</Wrapper>;
};
