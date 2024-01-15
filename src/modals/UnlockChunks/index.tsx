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
import { useLedgerHardware } from 'contexts/Hardware/Ledger/LedgerHardware';
import { Forms } from './Forms';
import { Overview } from './Overview';
import type { UnlockChunk } from 'contexts/Balances/types';

export const UnlockChunks = () => {
  const { t } = useTranslation('modals');
  const {
    config: { options },
    setModalHeight,
    modalMaxHeight,
  } = useOverlay().modal;
  const { getLedger } = useBalances();
  const { notEnoughFunds } = useTxMeta();
  const { activeAccount } = useActiveAccounts();
  const { getPoolUnlocking } = useActivePools();
  const { integrityChecked } = useLedgerHardware();
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
        ledger = getLedger({ stash: activeAccount });
        unlocking = ledger.unlocking;
    }
    return unlocking;
  };

  const unlocking = getUnlocking();

  // active modal section
  const [section, setSectionState] = useState<number>(0);
  const sectionRef = useRef(section);

  const setSection = (s: number) => {
    setStateWithRef(s, setSectionState, sectionRef);
  };

  // modal task
  const [task, setTask] = useState<string | null>(null);

  // unlock value of interest
  const [unlock, setUnlock] = useState<UnlockChunk | null>(null);

  // counter to trigger modal height calculation
  const [calculateHeight, setCalculateHeight] = useState<number>(0);
  const incrementCalculateHeight = () =>
    setCalculateHeight(calculateHeight + 1);

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

  const resizeCallback = () => {
    setModalHeight(getModalHeight());
  };

  // resize modal on state change
  useEffect(() => {
    setModalHeight(getModalHeight());
  }, [
    task,
    calculateHeight,
    notEnoughFunds,
    sectionRef.current,
    unlocking,
    integrityChecked,
  ]);

  // resize this modal on window resize
  useEffect(() => {
    window.addEventListener('resize', resizeCallback);
    return () => {
      window.removeEventListener('resize', resizeCallback);
    };
  }, []);

  return (
    <ModalSection type="carousel">
      <ModalFixedTitle ref={headerRef}>
        <Title title={t('unlocks')} fixed />
      </ModalFixedTitle>
      <ModalMotionTwoSection
        style={{
          maxHeight: modalMaxHeight - (headerRef.current?.clientHeight || 0),
        }}
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
        <div className="section">
          <Overview
            unlocking={unlocking}
            bondFor={bondFor}
            setSection={setSection}
            setUnlock={setUnlock}
            setTask={setTask}
            ref={overviewRef}
          />
        </div>
        <div className="section">
          <Forms
            incrementCalculateHeight={incrementCalculateHeight}
            setSection={setSection}
            unlock={unlock}
            task={task}
            ref={formsRef}
          />
        </div>
      </ModalMotionTwoSection>
    </ModalSection>
  );
};
