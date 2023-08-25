// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { ModalPadding } from '@polkadot-cloud/react';
import { Title } from 'library/Modal/Title';
import { useOverlay } from '@polkadot-cloud/react/hooks';
import { Wrapper } from './Wrapper';

export const Bio = () => {
  const { name, bio } = useOverlay().modal.config.options;

  return (
    <>
      <Title title={name} />
      <ModalPadding>
        <Wrapper>{bio !== undefined && <h4>{bio}</h4>}</Wrapper>
      </ModalPadding>
    </>
  );
};
