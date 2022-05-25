// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { HeadingWrapper } from '../Wrappers';
import { Wrapper } from './Wrapper';
import { Forms } from './Forms';

export const CreatePool = () => {
  return (
    <Wrapper>
      <HeadingWrapper>
        <FontAwesomeIcon transform="grow-2" icon={faPlus} />
        Create an staking pool
      </HeadingWrapper>
      <Forms />
    </Wrapper>
  );
};
