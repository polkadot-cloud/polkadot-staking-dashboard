// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { Title } from 'library/Modal/Title'
import { ModalPadding } from 'ui-core/overlay'
import { useOverlay } from 'ui-overlay'
import { Wrapper } from './Wrapper'

export const Bio = () => {
  const { name, bio } = useOverlay().modal.config.options

  return (
    <>
      <Title title={name} />
      <ModalPadding>
        <Wrapper>{bio !== undefined && <h4>{bio}</h4>}</Wrapper>
      </ModalPadding>
    </>
  )
}
