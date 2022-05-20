// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { HeadingWrapper } from '../Wrappers';
import { Wrapper, SectionsWrapper, FixedContentWrapper } from './Wrapper';
import { Forms } from './Forms';

export const CreatePool = () => {
  return (
    <Wrapper>
      <FixedContentWrapper>
        <HeadingWrapper>
          <FontAwesomeIcon transform="grow-2" icon={faPlus} />
          Create an staking pool
        </HeadingWrapper>
      </FixedContentWrapper>
      <Forms />
    </Wrapper>
  );
};
