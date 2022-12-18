// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { forwardRef } from 'react';
import { ContentWrapper } from '../Wrappers';
import { UnbondAll } from './UnbondAll';

export const Forms = forwardRef((props: any, ref: any) => {
  const { task } = props;
  return (
    <ContentWrapper ref={ref}>
      {task === 'unbond_all' && <UnbondAll {...props} />}
    </ContentWrapper>
  );
});
