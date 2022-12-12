// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useModal } from 'contexts/Modal';
import { Title } from 'library/Modal/Title';
import { PaddingWrapper } from '../Wrappers';
import { Wrapper } from './Wrapper';

export const Bio = () => {
  const { config } = useModal();
  const { name, bio } = config;

  return (
    <>
      <Title title={name} />
      <PaddingWrapper>
        <Wrapper>{bio !== undefined && <h4>{t('modals.bio')}</h4>}</Wrapper>
      </PaddingWrapper>
    </>
  );
};

export default Bio;
