// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { faMinus, faPlus } from '@fortawesome/free-solid-svg-icons';
import { useModal } from 'contexts/Modal';
import { Title } from 'library/Modal/Title';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Forms } from './Forms';
import { Tasks } from './Tasks';
import { CardsWrapper, FixedContentWrapper, Wrapper } from './Wrappers';

export const UpdateBond = () => {
  const { config, setModalHeight } = useModal();
  const { fn, bondType } = config;

  // modal task
  const [task, setTask] = useState(null);
  const { t } = useTranslation('modals');

  // active modal section
  const [section, setSection] = useState(0);

  // increment to resize modal
  const [localResize, _setLocalResize] = useState(0);
  const setLocalResize = () => {
    _setLocalResize(localResize + 1);
  };

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
  }, [section, task, localResize]);

  return (
    <Wrapper>
      <FixedContentWrapper ref={headerRef}>
        <Title
          title={`${fn === 'add' ? t('add_to') : t('remove')} ${t('bond')}`}
          icon={fn === 'add' ? faPlus : faMinus}
          fixed
        />
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
        <Forms
          section={section}
          setSection={setSection}
          task={task}
          ref={formsRef}
          bondType={bondType}
          setLocalResize={setLocalResize}
        />
      </CardsWrapper>
    </Wrapper>
  );
};

export default UpdateBond;
