// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useUi } from 'contexts/UI';
import { PageProps } from '../types';
import { Wrapper } from './Wrappers';
import { Active } from './Active';
import { Setup } from './Setup';

export const Nominate = (props: PageProps) => {
  const { page } = props;
  const { title } = page;
  const { onNominatorSetup } = useUi();

  return (
    <Wrapper>{onNominatorSetup ? <Setup /> : <Active title={title} />}</Wrapper>
  );
};

export default Nominate;
