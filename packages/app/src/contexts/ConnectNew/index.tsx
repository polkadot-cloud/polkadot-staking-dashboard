// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: AGPL-3.0

import type { ReactNode } from 'react'
import { createContext, useContext, useRef, useState } from 'react'
import {
  defaultConnectNewContext,
  defaultOverlayPosition,
  TAB_TRANSITION_DURATION_MS,
} from './defaults'
import type {
  ConnectNewContextInterface,
  ConnectOverlayPosition,
} from './types'

export const ConnectContext = createContext<ConnectNewContextInterface>(
  defaultConnectNewContext
)

export const useConnectNew = () => useContext(ConnectContext)

export const ConnectNewProvider = ({ children }: { children: ReactNode }) => {
  // Whether the overlay is currently open. This initiates context state but does not
  // reflect whether the overlay is being displayed.
  const [open, setOpen] = useState<boolean>(false)

  // Whether the overlay is currently showing.
  const [show, setShow] = useState<boolean>(false)

  // Store whether the overlay is hidden. Used when closing the overlay.
  const [hidden, setHidden] = useState<boolean>(false)

  // The overlay position coordinates.
  const [position, setPosition] = useState<
    [ConnectOverlayPosition, ConnectOverlayPosition]
  >([0, 0])

  // Overlay ref for position access.
  const overlayRef = useRef<HTMLDivElement>(null)

  // Re-syncs the connect overlay position to the default co-ordinates, ensuring it stays at the top
  // right of the window. Can be used with window resizing or on open.
  const syncPosition = () => {
    const bodyRect = document.body.getBoundingClientRect()

    // NOTE: Position is currently hard-coded. Could change if a drag functionality is introduced.
    const x =
      bodyRect.width -
      defaultOverlayPosition.right -
      (overlayRef.current?.clientWidth || 0)

    const y = defaultOverlayPosition.right
    setPosition([x, y])
  }

  // Sets the overlay position and opens it. Only succeeds if the overlay has been instantiated and
  // is not currently open.
  const openConnectOverlay = () => {
    if (open) {
      return
    }
    syncPosition()
    setOpen(true)
  }

  // Dismiss the overlay. This should be called when the overlay is closed. Calls `closeOverlay`
  // once transition is complete.
  const dismissOverlay = () => {
    setHidden(true)
    setTimeout(() => {
      closeConnectOverlay()
      setHidden(false)
    }, TAB_TRANSITION_DURATION_MS)
  }

  // Closes the overlay.
  const closeConnectOverlay = () => {
    setShow(false)
    setOpen(false)
  }

  // Adjusts overlay position and shows the menu.
  const checkOverlayPosition = () => {
    if (!overlayRef?.current) {
      return
    }

    // Adjust overlay position if it is leaking out of the window, otherwise keep it at the current
    // position.
    const bodyRect = document.body.getBoundingClientRect()
    const menuRect = overlayRef.current.getBoundingClientRect()
    const hiddenRight = menuRect.right > bodyRect.width
    const hiddenBottom = menuRect.bottom > bodyRect.height

    const x = hiddenRight ? window.innerWidth - menuRect.width : position[0]
    const y = hiddenBottom ? window.innerHeight - menuRect.height : position[1]

    setPosition([x, y])
    setShow(true)
  }

  return (
    <ConnectContext.Provider
      value={{
        open,
        show,
        hidden,
        position,
        overlayRef,
        syncPosition,
        dismissOverlay,
        closeConnectOverlay,
        openConnectOverlay,
        checkOverlayPosition,
      }}
    >
      {children}
    </ConnectContext.Provider>
  )
}
