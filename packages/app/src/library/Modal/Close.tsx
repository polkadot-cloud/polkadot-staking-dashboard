// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import CrossSVG from 'img/cross.svg?react'
import { useOverlay } from 'kits/Overlay/Provider'
import { CloseWrapper } from './Wrappers'

export const Close = () => {
  const { setModalStatus } = useOverlay().modal

  return (
    <CloseWrapper>
      <button type="button" onClick={() => setModalStatus('closing')}>
        <CrossSVG style={{ width: '1.25rem', height: '1.25rem' }} />
      </button>
    </CloseWrapper>
  )
}
