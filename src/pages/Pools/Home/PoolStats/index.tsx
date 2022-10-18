// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { CardHeaderWrapper, CardWrapper } from 'library/Graphs/Wrappers';

import { Announcements } from './Announcements';
import { Header } from './Header';
import { Wrapper } from './Wrappers';

export const PoolStats = () => {
  return (
    <CardWrapper>
      <CardHeaderWrapper>
        <h3>Pool Stats</h3>
      </CardHeaderWrapper>
      <Wrapper>
        <Header />
        <Announcements />
      </Wrapper>
    </CardWrapper>
  );
};
