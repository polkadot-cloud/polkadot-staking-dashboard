// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { faMinus } from '@fortawesome/free-solid-svg-icons';
import { useModal } from 'contexts/Modal';
import { Title } from 'library/Modal/Title';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Tasks } from './Tasks';
import { CardsWrapper, FixedContentWrapper, Wrapper } from './Wrappers';

export const UpdateBond = () => {
  const { config, setModalHeight } = useModal();
  const { bondType } = config;

  // modal task
  const [task, setTask] = useState(null);
  const { t } = useTranslation('modals');

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
        <Title title={`${t('remove')} ${t('bond')}`} icon={faMinus} fixed />
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
        <Tasks
          bondType={bondType}
          setSection={setSection}
          setTask={setTask}
          ref={tasksRef}
        />
      </CardsWrapper>
    </Wrapper>
  );
};

export default UpdateBond;
