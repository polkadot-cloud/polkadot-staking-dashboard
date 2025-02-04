// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { Close as Wrapper } from 'ui-core/modal'
import { useOverlay } from 'ui-overlay'

export const Close = () => {
  const { setModalStatus } = useOverlay().modal

  return <Wrapper onClose={() => setModalStatus('closing')} />
}
