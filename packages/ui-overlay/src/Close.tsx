// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { ModalClose } from 'ui-core/overlay'
import { useOverlay } from 'ui-overlay'

export const Close = () => {
  const { setModalStatus } = useOverlay().modal

  return <ModalClose onClose={() => setModalStatus('closing')} />
}
