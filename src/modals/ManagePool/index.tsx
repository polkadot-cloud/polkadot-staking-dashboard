// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { ModalSection } from '@polkadotcloud/core-ui';
import { useModal } from 'contexts/Modal';
import { Title } from 'library/Modal/Title';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FixedTitleWrapper, TwoSectionsWrapper } from '../Wrappers';
import { Forms } from './Forms';
import { Tasks } from './Tasks';

export const ManagePool = () => {
  const { t } = useTranslation('modals');
  const { setModalHeight } = useModal();

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

  // Resize modal on state change.
  useEffect(() => {
    let height = headerRef.current?.clientHeight || 0;
    if (section === 0) {
      height += tasksRef.current?.clientHeight || 0;
    } else {
      height += formsRef.current?.clientHeight || 0;
    }
    setModalHeight(height);
  }, [section, task, calculateHeight]);

  return (
    <ModalSection type="carousel">
      <FixedTitleWrapper ref={headerRef}>
        <Title title={t('managePool')} fixed />
      </FixedTitleWrapper>
      <TwoSectionsWrapper
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
        <Tasks setSection={setSection} setTask={setTask} ref={tasksRef} />
        <Forms
          setSection={setSection}
          task={task}
          section={section}
          ref={formsRef}
          incrementCalculateHeight={incrementCalculateHeight}
        />
      </TwoSectionsWrapper>
    </ModalSection>
  );
};
