// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { faCog } from '@fortawesome/free-solid-svg-icons';
import { useModal } from 'contexts/Modal';
import { Title } from 'library/Modal/Title';
import { useTranslation } from 'react-i18next';
import { useEffect, useRef, useState } from 'react';
import { Wrapper, CardsWrapper, FixedContentWrapper } from './Wrappers';
import { Tasks } from './Tasks';
import { Forms } from './Forms';

export const ManagePool = () => {
  const { setModalHeight } = useModal();
  // modal task
  const [task, setTask] = useState(null);
  const { t } = useTranslation('common');

  // active modal section
  const [section, setSection] = useState(0);

  // refs for wrappers
  const headerRef = useRef<HTMLDivElement>(null);
  const tasksRef = useRef<HTMLDivElement>(null);
  const formsRef = useRef<HTMLDivElement>(null);

  // resize modal on state change
  useEffect(() => {
    let _height = headerRef.current?.clientHeight ?? 0;
    if (section === 0) {
      _height += tasksRef.current?.clientHeight ?? 0;
    } else {
      _height += formsRef.current?.clientHeight ?? 0;
    }
    setModalHeight(_height);
  }, [section, task]);

  return (
    <Wrapper>
      <FixedContentWrapper ref={headerRef}>
        <Title title={t('modals.manage_pool')} icon={faCog} fixed />
      </FixedContentWrapper>
      <CardsWrapper
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
        />
      </CardsWrapper>
    </Wrapper>
  );
};
