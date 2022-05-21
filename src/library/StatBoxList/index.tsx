// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { Wrapper, ListWrapper } from './Wrapper';

export const StatBoxList = ({ children }: any) => {
  return (
    <Wrapper className="page-padding">
      <ListWrapper>{children}</ListWrapper>
    </Wrapper>
  );
};

export default StatBoxList;
