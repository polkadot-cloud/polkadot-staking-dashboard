// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useAnimation } from 'framer-motion'
import { useEffect } from 'react'
import type { CanvasStatus } from 'types'
import { Backdrop } from 'ui-core/overlay'
import { useOverlay } from './Provider'

export const Background = ({
  externalOverlayStatus,
}: {
  externalOverlayStatus?: CanvasStatus
}) => {
  const controls = useAnimation()
  const {
    modal: { status: modalStatus },
    canvas: { status: canvasStatus },
  } = useOverlay()

  let { openOverlayInstances } = useOverlay()
  if (externalOverlayStatus === 'open') {
    openOverlayInstances++
  }

  const onIn = async () => await controls.start('visible')

  const onOut = async () => await controls.start('hidden')

  useEffect(() => {
    if (openOverlayInstances > 0) {
      onIn()
    }
    if (openOverlayInstances === 0) {
      onOut()
    }
  }, [openOverlayInstances])

  return modalStatus === 'closed' &&
    canvasStatus === 'closed' &&
    externalOverlayStatus === 'closed' ? null : (
    <Backdrop
      blur={
        externalOverlayStatus === 'open' || canvasStatus === 'open'
          ? '1.4rem'
          : '0rem'
      }
      initial={{
        opacity: 0,
      }}
      animate={controls}
      transition={{
        duration: 0.15,
      }}
      variants={{
        hidden: {
          opacity: 0,
        },
        visible: {
          opacity: 1,
        },
      }}
    />
  )
}
