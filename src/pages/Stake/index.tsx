// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { PageProps } from '../types';
import { Wrapper } from './Wrappers';
import { useUi } from '../../contexts/UI';
import { useStaking } from '../../contexts/Staking';
import { Active } from './Active';
import { Setup } from './Setup';
import { Stake as Loader } from '../../library/Loaders/Stake';
import { PageTitle } from '../../library/PageTitle';

export const Stake = (props: PageProps) => {
  const { inSetup } = useStaking();
  const { isSyncing } = useUi();

  const { page } = props;
  const { title } = page;

  const _inSetup: boolean = inSetup();
  const _isSyncing = isSyncing();

  return (
    <Wrapper>
      {_isSyncing ? (
        <>
          <PageTitle title={`${title}`} />
          <Loader />
        </>
      ) : (
        <>{_inSetup ? <Setup title={title} /> : <Active title={title} />}</>
      )}
    </Wrapper>
  );
};

export default Stake;
