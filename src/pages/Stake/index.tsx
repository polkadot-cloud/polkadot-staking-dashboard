// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useUi } from 'contexts/UI';
import { ErrorBoundary } from 'ErrorsBoundary';
import { PageProps } from '../types';
import { Wrapper } from './Wrappers';
import { Active } from './Active';
import { Setup } from './Setup';

export const Stake = (props: PageProps) => {
  const { page } = props;
  const { title } = page;
  const { onSetup, setOnSetup } = useUi();

  if (!window) throw new Error('Failed To Get The Stake Page');

  return (
    <ErrorBoundary>
      <Wrapper>
        {onSetup ? (
          <Setup title={title} setOnSetup={setOnSetup} />
        ) : (
          <Active title={title} setOnSetup={setOnSetup} />
        )}
      </Wrapper>
    </ErrorBoundary>
  );
};

export default Stake;
