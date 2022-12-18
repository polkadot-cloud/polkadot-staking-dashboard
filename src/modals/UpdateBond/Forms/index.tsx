// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { forwardRef } from 'react';
import { ContentWrapper } from '../Wrappers';
import { UnbondAll } from './UnbondAll';
import { UnbondPoolToMinimum } from './UnbondPoolToMinimum';
import { UnbondSome } from './UnbondSome';

export const Forms = forwardRef((props: any, ref: any) => {
  const { task } = props;
  return (
    <ContentWrapper ref={ref}>
      {task === 'unbond_some' && <UnbondSome {...props} />}
      {task === 'unbond_all' && <UnbondAll {...props} />}
      {task === 'unbond_pool_to_minimum' && <UnbondPoolToMinimum {...props} />}
    </ContentWrapper>
  );
});
