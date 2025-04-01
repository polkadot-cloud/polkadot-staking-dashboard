// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { Close as Wrapper } from 'ui-core/canvas'
import { useOverlay } from 'ui-overlay'

export const CloseCanvas = ({ sm }: { sm?: boolean }) => {
  const { setCanvasStatus } = useOverlay().canvas

  return <Wrapper sm={sm} onClose={() => setCanvasStatus('closing')} />
}
