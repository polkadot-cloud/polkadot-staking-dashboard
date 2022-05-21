// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLockOpen } from '@fortawesome/free-solid-svg-icons';
import { HeadingWrapper } from '../Wrappers';
import { Wrapper, FixedContentWrapper, SectionsWrapper } from './Wrappers';
import { useBalances } from '../../contexts/Balances';
import { useConnect } from '../../contexts/Connect';
import { Overview } from './Overview';
import { Forms } from './Forms';

export const UnlockChunks = () => {
  const { activeAccount } = useConnect();
  const { getBondedAccount, getAccountLedger }: any = useBalances();
  const controller = getBondedAccount(activeAccount);
  const ledger = getAccountLedger(controller);
  const { unlocking } = ledger;

  // active modal section
  const [section, setSection] = useState(0);

  // modal task
  const [task, setTask]: any = useState(null);

  // unlock value of interest
  const [unlock, setUnlock] = useState(null);

  return (
    <Wrapper>
      <FixedContentWrapper>
        <HeadingWrapper>
          <FontAwesomeIcon transform="grow-2" icon={faLockOpen} />
          {unlocking.length > 0 && `${unlocking.length} `}Unlock Chunk
          {unlocking.length === 1 ? '' : 's'}
        </HeadingWrapper>
      </FixedContentWrapper>
      <SectionsWrapper
        animate={section === 0 ? 'home' : 'next'}
        transition={{
          duration: 0.5,
          type: 'spring',
          bounce: 0.22,
        }}
        variants={{
          home: {
            left: 0,
          },
          next: {
            left: '-100%',
          },
        }}
      >
        <Overview
          setSection={setSection}
          setUnlock={setUnlock}
          setTask={setTask}
        />
        <Forms setSection={setSection} unlock={unlock} task={task} />
      </SectionsWrapper>
    </Wrapper>
  );
};
