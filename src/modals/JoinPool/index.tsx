// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { HeadingWrapper, PaddingWrapper } from '../Wrappers';
import { Forms } from './Forms';

export const JoinPool = () => {
  return (
    <PaddingWrapper>
      <HeadingWrapper>
        <FontAwesomeIcon transform="grow-2" icon={faPlus} />
        Join Pool
      </HeadingWrapper>
      <Forms />
    </PaddingWrapper>
  );
};
