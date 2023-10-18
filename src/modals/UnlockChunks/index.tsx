// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import {
  ModalFixedTitle,
  ModalMotionTwoSection,
  ModalSection,
} from '@polkadot-cloud/react';
import { setStateWithRef } from '@polkadot-cloud/utils';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useBalances } from 'contexts/Balances';
import { useActivePools } from 'contexts/Pools/ActivePools';
import { Title } from 'library/Modal/Title';
import { useTxMeta } from 'contexts/TxMeta';
import { useOverlay } from '@polkadot-cloud/react/hooks';
import { useActiveAccounts } from 'contexts/ActiveAccounts';
import { Forms } from './Forms';
import { Overview } from './Overview';

export const UnlockChunks = () => {
  const { t } = useTranslation('modals');
  const { activeAccount } = useActiveAccounts();
  const { notEnoughFunds } = useTxMeta();
  const { getStashLedger } = useBalances();
  const {
    config: { options },
    setModalHeight,
  } = useOverlay().modal;
  const { getPoolUnlocking } = useActivePools();
  const { bondFor } = options || {};

  // get the unlocking per bondFor
  const getUnlocking = () => {
    let unlocking = [];
    let ledger;
    switch (bondFor) {
      case 'pool':
        unlocking = getPoolUnlocking();
        break;
      default:
        ledger = getStashLedger(activeAccount);
        unlocking = ledger.unlocking;
    }
    return unlocking;
  };

  const unlocking = getUnlocking();

  // active modal section
  const [section, setSectionState] = useState(0);
  const sectionRef = useRef(section);

  const setSection = (s: number) => {
    setStateWithRef(s, setSectionState, sectionRef);
  };

  // modal task
  const [task, setTask] = useState<string | null>(null);

  // unlock value of interest
  const [unlock, setUnlock] = useState(null);

  // refs for wrappers
  const headerRef = useRef<HTMLDivElement>(null);
  const overviewRef = useRef<HTMLDivElement>(null);
  const formsRef = useRef<HTMLDivElement>(null);

  const getModalHeight = () => {
    let h = headerRef.current?.clientHeight ?? 0;

    if (sectionRef.current === 0) {
      h += overviewRef.current?.clientHeight ?? 0;
    } else {
      h += formsRef.current?.clientHeight ?? 0;
    }
    return h;
  };

  // resize modal on state change
  useEffect(() => {
    setModalHeight(getModalHeight());
  }, [task, notEnoughFunds, sectionRef.current, unlocking]);

  // resize this modal on window resize
  useEffect(() => {
    window.addEventListener('resize', resizeCallback);
    return () => {
      window.removeEventListener('resize', resizeCallback);
    };
  }, []);
  const resizeCallback = () => {
    setModalHeight(getModalHeight());
  };

  return (
    <ModalSection type="carousel">
      <ModalFixedTitle ref={headerRef}>
        <Title title={t('unlocks')} fixed />
      </ModalFixedTitle>
      <ModalMotionTwoSection
        animate={sectionRef.current === 0 ? 'home' : 'next'}
        transition={{
          duration: 0.5,
          type: 'spring',
          bounce: 0.1,
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
          unlocking={unlocking}
          bondFor={bondFor}
          setSection={setSection}
          setUnlock={setUnlock}
          setTask={setTask}
          ref={overviewRef}
        />
        <Forms
          setSection={setSection}
          unlock={unlock}
          task={task}
          ref={formsRef}
        />
      </ModalMotionTwoSection>
    </ModalSection>
  );
};
