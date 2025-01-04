// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useAnimation } from 'framer-motion'
import type { FC } from 'react'
import { useEffect } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { CanvasContainer } from '../../ui-core/src/overlay/CanvasContainer'
import { CanvasContent } from '../../ui-core/src/overlay/CanvasContent'
import { CanvasScroll } from '../../ui-core/src/overlay/CanvasScroll'
import { ModalContent } from '../../ui-core/src/overlay/ModalContent'
import { useOverlay } from './Provider'
import type { CanvasProps } from './Provider/types'

export const Canvas = ({
  canvas,
  externalOverlayStatus,
  fallback: Fallback,
}: CanvasProps) => {
  const controls = useAnimation()
  const {
    setOpenOverlayInstances,
    activeOverlayInstance,
    setActiveOverlayInstance,
    modal: { status: modalStatus },
    canvas: {
      status,
      setCanvasStatus,
      config: { key, size },
    },
  } = useOverlay()

  const onIn = async () => {
    await controls.start('visible')
  }

  const onOut = async (closing: boolean) => {
    if (closing) {
      setOpenOverlayInstances('dec', 'canvas')
      setActiveOverlayInstance(modalStatus === 'open' ? 'modal' : null)
    }
    await controls.start('hidden')

    if (closing) {
      setCanvasStatus('closed')
    }
  }

  // Control dim help status change
  useEffect(() => {
    if (externalOverlayStatus === 'open' && status === 'open') {
      onOut(false)
    }

    if (externalOverlayStatus === 'closing') {
      if (activeOverlayInstance === 'canvas') {
        setCanvasStatus('open')
        onIn()
      }
    }
  }, [externalOverlayStatus])

  // Control fade in and out on opening and closing states
  useEffect(() => {
    if (status === 'open') {
      onIn()
    }
    if (status === 'closing') {
      onOut(true)
    }
  }, [status])

  const ActiveCanvas: FC | null = canvas?.[key] || null

  return status === 'closed' ? null : (
    <CanvasContainer
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
    >
      <CanvasScroll size={size}>
        <ModalContent canvas>
          <CanvasContent>
            <ErrorBoundary FallbackComponent={Fallback}>
              {ActiveCanvas && <ActiveCanvas />}
            </ErrorBoundary>
          </CanvasContent>
        </ModalContent>
      </CanvasScroll>
    </CanvasContainer>
  )
}
