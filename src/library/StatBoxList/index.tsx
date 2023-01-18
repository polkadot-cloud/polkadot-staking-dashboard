// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { ListWrapper, Wrapper } from './Wrapper';

export const StatBoxList = ({ children }: { children: React.ReactNode }) => {
  return (
    <Wrapper className="page-padding">
      <ListWrapper>{children}</ListWrapper>
    </Wrapper>
  );
};

export default StatBoxList;
