// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { Wrapper } from './Wrappers';

export const Container = ({ children }: { children: React.ReactNode }) => (
  <Wrapper>
    <div className="hide-scrollbar">
      <div>{children}</div>
    </div>
  </Wrapper>
);
