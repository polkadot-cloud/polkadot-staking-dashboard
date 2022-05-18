// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faMinus } from '@fortawesome/free-solid-svg-icons';
import { HeadingWrapper } from '../Wrappers';
import { useModal } from '../../contexts/Modal';
import { Wrapper, SectionsWrapper, FixedContentWrapper } from './Wrapper';
import { Tasks } from './Tasks';
import { Forms } from './Forms';

export const UpdateBond = () => {
  const { config }: any = useModal();
  const { fn } = config;

  // modal task
  const [task, setTask]: any = useState(null);

  // active modal section
  const [section, setSection] = useState(0);

  return (
    <Wrapper>
      <FixedContentWrapper>
        <HeadingWrapper>
          <FontAwesomeIcon transform="grow-2" icon={fn === 'add' ? faPlus : faMinus} />
          {fn === 'add' ? 'Add To' : 'Remove'}
          {' '}
          Bond
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
        <Tasks
          setSection={setSection}
          setTask={setTask}
        />
        <Forms
          setSection={setSection}
          task={task}
        />
      </SectionsWrapper>
    </Wrapper>
  );
};

export default UpdateBond;
