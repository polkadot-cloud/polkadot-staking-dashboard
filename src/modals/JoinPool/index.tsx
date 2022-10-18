// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { faUserPlus } from '@fortawesome/free-solid-svg-icons';
import { Title } from 'library/Modal/Title';

import { PaddingWrapper } from '../Wrappers';
import { Forms } from './Forms';

export const JoinPool = () => {
  return (
    <>
      <Title title="Join Pool" icon={faUserPlus} />
      <PaddingWrapper>
        <Forms />
      </PaddingWrapper>
    </>
  );
};
