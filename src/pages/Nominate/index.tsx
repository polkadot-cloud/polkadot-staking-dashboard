// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { Active } from './Active';
import { NominationGeo } from './NominationGeo';
import { Wrapper } from './Wrappers';

export const Nominate = () => (
  <Wrapper>
    <Active />
    <NominationGeo />
  </Wrapper>
);
