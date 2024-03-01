// Copyright 2024 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { Title } from 'library/Modal/Title';
import { useOverlay } from 'kits/Overlay/Provider';
import { Wrapper } from './Wrapper';
import { ModalPadding } from 'kits/Overlay/structure/ModalPadding';

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
