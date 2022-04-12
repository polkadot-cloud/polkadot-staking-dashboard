// Copyright 2022 @rossbulat/polkadot-staking-experience authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useState } from 'react';
import { PageProps } from '../types';
import { Wrapper } from './Wrappers';
import { useBalances } from '../../contexts/Balances';
import { planckToDot } from '../../Utils';
import { useConnect } from '../../contexts/Connect';
import { useUi } from '../../contexts/UI';
import { PageTitle } from '../../library/PageTitle';
import { useStaking } from '../../contexts/Staking';
import { Active } from './Active';
import { Setup } from './Setup';

export const Stake = (props: PageProps) => {

  const { activeAccount } = useConnect();
  const { getAccountLedger, getBondedAccount }: any = useBalances();
  const { inSetup } = useStaking();
  const { isSyncing } = useUi();

  // monitor page title sticky
  const [stickyTitle, setStickyTitle] = useState(false);

  const { page } = props;
  const { title } = page;
  const controller = getBondedAccount(activeAccount);
  const ledger = getAccountLedger(controller);

  let { unlocking } = ledger;
  let totalUnlocking = 0;
  for (let i = 0; i < unlocking.length; i++) {
    unlocking[i] = planckToDot(unlocking[i]);
    totalUnlocking += unlocking[i];
  }

  let _inSetup: boolean = inSetup();
  let _isSyncing = isSyncing();

  return (
    <>
      <Wrapper>
        <PageTitle title={title} setStickyTitle={setStickyTitle} />

        {_isSyncing
          ? <></>
          : <>
            {_inSetup
              ? <Setup stickyTitle={stickyTitle} />
              : <Active />
            }
          </>
        }
      </Wrapper>
    </>
  );
}

export default Stake;