// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import {
  ModalFixedTitle,
  ModalMotionTwoSection,
  ModalPadding,
  ModalSection,
} from '@polkadot-cloud/react';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useActivePools } from 'contexts/Pools/ActivePools';
import { Title } from 'library/Modal/Title';
import { useTxMeta } from 'contexts/TxMeta';
import { useOverlay } from '@polkadot-cloud/react/hooks';
import { useLedgerHardware } from 'contexts/Hardware/Ledger/LedgerHardware';
import { Forms } from './Forms';
import { Tasks } from './Tasks';

export const ManagePool = () => {
  const { t } = useTranslation('modals');
  const { notEnoughFunds } = useTxMeta();
  const { integrityChecked } = useLedgerHardware();
  const { isOwner, selectedActivePool } = useActivePools();
  const { setModalHeight, modalMaxHeight } = useOverlay().modal;

  // modal task
  const [task, setTask] = useState<string>();

  // active modal section
  const [section, setSection] = useState<number>(0);

  // counter to trigger modal height calculation
  const [calculateHeight, setCalculateHeight] = useState<number>(0);
  const incrementCalculateHeight = () =>
    setCalculateHeight(calculateHeight + 1);

  // refs for wrappers
  const headerRef = useRef<HTMLDivElement>(null);
  const tasksRef = useRef<HTMLDivElement>(null);
  const formsRef = useRef<HTMLDivElement>(null);

  const refreshModalHeight = () => {
    let height = headerRef.current?.clientHeight || 0;
    if (section === 0) {
      height += tasksRef.current?.clientHeight || 0;
    } else {
      height += formsRef.current?.clientHeight || 0;
    }
    setModalHeight(height);
  };

  // Resize modal on state change.
  useEffect(() => {
    refreshModalHeight();
  }, [
    integrityChecked,
    section,
    task,
    notEnoughFunds,
    calculateHeight,
    selectedActivePool?.bondedPool?.state,
  ]);

  useEffect(() => {
    window.addEventListener('resize', refreshModalHeight);
    return () => {
      window.removeEventListener('resize', refreshModalHeight);
    };
  }, []);

  return (
    <ModalSection type="carousel">
      <ModalFixedTitle ref={headerRef}>
        <Title
          title={`${t('managePool')}${!isOwner() ? ` Membership` : ``}`}
          fixed
        />
      </ModalFixedTitle>
      <ModalMotionTwoSection
        style={{
          maxHeight: modalMaxHeight - (headerRef.current?.clientHeight || 0),
        }}
        animate={section === 0 ? 'home' : 'next'}
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
          <ModalPadding horizontalOnly>
            <Tasks setSection={setSection} setTask={setTask} ref={tasksRef} />
          </ModalPadding>
        </div>

        <div className="section">
          <Forms
            setSection={setSection}
            task={task}
            section={section}
            ref={formsRef}
            incrementCalculateHeight={incrementCalculateHeight}
          />
        </div>
      </ModalMotionTwoSection>
    </ModalSection>
  );
};
