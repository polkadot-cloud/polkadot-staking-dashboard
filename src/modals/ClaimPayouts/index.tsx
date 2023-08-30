// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import {
  ModalFixedTitle,
  ModalMotionTwoSection,
  ModalSection,
} from '@polkadot-cloud/react';
import { setStateWithRef } from '@polkadot-cloud/utils';
import { useEffect, useRef, useState } from 'react';
import { Title } from 'library/Modal/Title';
import { useTxMeta } from 'contexts/TxMeta';
import { useOverlay } from '@polkadot-cloud/react/hooks';
import { usePayouts } from 'contexts/Payouts';
import { Forms } from './Forms';
import { Overview } from './Overview';

export const ClaimPayouts = () => {
  const { notEnoughFunds } = useTxMeta();
  const { unclaimedPayouts } = usePayouts();
  const { setModalHeight } = useOverlay().modal;

  // active modal section
  const [section, setSectionState] = useState(0);
  const sectionRef = useRef(section);

  const setSection = (s: number) => {
    setStateWithRef(s, setSectionState, sectionRef);
  };

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

  // Resize modal on state change.
  useEffect(() => {
    setModalHeight(getModalHeight());
  }, [unclaimedPayouts, notEnoughFunds, sectionRef.current]);

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
        <Title title="Claim Payouts" fixed />
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
          setSection={setSection}
          setUnlock={setUnlock}
          ref={overviewRef}
        />
        <Forms setSection={setSection} unlock={unlock} ref={formsRef} />
      </ModalMotionTwoSection>
    </ModalSection>
  );
};
