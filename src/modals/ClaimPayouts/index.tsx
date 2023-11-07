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
import { useTranslation } from 'react-i18next';
import { Forms } from './Forms';
import { Overview } from './Overview';
import type { ActivePayout } from './types';

export const ClaimPayouts = () => {
  const { t } = useTranslation('modals');
  const { notEnoughFunds } = useTxMeta();
  const { unclaimedPayouts } = usePayouts();
  const { setModalHeight, modalMaxHeight } = useOverlay().modal;

  // Active modal section.
  const [section, setSectionState] = useState(0);
  const sectionRef = useRef(section);

  const setSection = (s: number) => {
    setStateWithRef(s, setSectionState, sectionRef);
  };

  // Unclaimed payout(s) that will be applied to submission form.
  const [payouts, setPayouts] = useState<ActivePayout[] | null>(null);

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
  }, [unclaimedPayouts, notEnoughFunds, section]);

  // Resize this modal on window resize.
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
        <Title title={t('claimPayouts')} fixed />
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
            setSection={setSection}
            setPayouts={setPayouts}
            ref={overviewRef}
          />
        </div>
        <div className="section">
          <Forms
            ref={formsRef}
            payouts={payouts}
            setPayouts={setPayouts}
            setSection={setSection}
          />
        </div>
      </ModalMotionTwoSection>
    </ModalSection>
  );
};
