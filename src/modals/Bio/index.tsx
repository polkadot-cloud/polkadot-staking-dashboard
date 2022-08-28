// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useModal } from 'contexts/Modal';
import { PaddingWrapper } from '../Wrappers';
import { Wrapper } from './Wrapper';

export const Bio = () => {
  const { config } = useModal();
  const { name, bio } = config;

  return (
    <PaddingWrapper>
      <Wrapper>
        <h2>{name}</h2>
        {bio !== undefined && <h4>{bio}</h4>}
      </Wrapper>
    </PaddingWrapper>
  );
};

export default Bio;
