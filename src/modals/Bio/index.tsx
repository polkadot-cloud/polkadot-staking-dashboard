// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { ModalPadding } from '@polkadot-cloud/react';
import { useModal } from 'contexts/Modal';
import { Title } from 'library/Modal/Title';
import { Wrapper } from './Wrapper';

export const Bio = () => {
  const { config } = useModal();
  const { name, bio } = config;

  return (
    <>
      <Title title={name} />
      <ModalPadding>
        <Wrapper>{bio !== undefined && <h4>{bio}</h4>}</Wrapper>
      </ModalPadding>
    </>
  );
};
