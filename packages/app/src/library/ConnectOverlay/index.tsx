// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: AGPL-3.0

import extensions from '@w3ux/extension-assets'
import type { ExtensionArrayListItem } from '@w3ux/extension-assets/util'
import { useOutsideAlerter } from '@w3ux/hooks'
import { useExtensions } from '@w3ux/react-connect-kit'
import { useConnectNew } from 'contexts/ConnectNew'
import {
  CONNECT_OVERLAY_MAX_WIDTH,
  DocumentPadding,
  TAB_TRANSITION_DURATION_MS,
} from 'contexts/ConnectNew/defaults'
import { motion } from 'framer-motion'
import { useEffect } from 'react'
import { Inner } from './Inner'
import { mobileCheck } from './Utils'
import { Wrapper } from './Wrappers'

export const ConnectOverlay = () => {
  const {
    open,
    show,
    hidden,
    overlayRef,
    syncPosition,
    dismissOverlay,
    position: [x, y],
    checkOverlayPosition,
  } = useConnectNew()
  const { extensionsStatus } = useExtensions()

  // Whether the app is running on mobile.
  const isMobile = mobileCheck()

  // Whether the app is running in Nova Wallet.
  const inNova = !!window?.walletExtension?.isNovaWallet || false

  // Whether the app is running in a SubWallet Mobile.
  const inSubWallet = !!window.injectedWeb3?.['subwallet-js'] && isMobile

  // Unsupported extensions - will not display.
  const UNSUPPORTED_EXTENSIONS = ['metamask-polkadot-snap', 'polkagate-snap']

  // Format supported extensions as array.
  const extensionsAsArray = Object.entries(extensions)
    .filter(([key]) => !UNSUPPORTED_EXTENSIONS.includes(key))
    .map(([key, value]) => ({
      id: key,
      ...value,
    })) as ExtensionArrayListItem[]

  // Determine which web extensions to display. Only display Subwallet Mobile or Nova if in one of
  // those environments. In Nova Wallet's case, fetch `nova-wallet` metadata and overwrite
  // `polkadot-js` with it. Otherwise, keep all `web-extension` category items.
  const web = inSubWallet
    ? extensionsAsArray.filter((a) => a.id === 'subwallet-js')
    : inNova
      ? extensionsAsArray
          .filter((a) => a.id === 'nova-wallet')
          .map((a) => ({ ...a, id: 'polkadot-js' }))
      : // Otherwise, keep all extensions except `polkadot-js`.
        extensionsAsArray.filter((a) => a.category === 'web-extension')

  const installed = web.filter((a) =>
    Object.keys(extensionsStatus).find((key) => key === a.id)
  )
  const other = web.filter((a) => !installed.find((b) => b.id === a.id))

  // Handler for closing the overlay on window resize.
  const resizeCallback = () => {
    syncPosition()
  }

  // Close the overlay if clicked outside of its container.
  useOutsideAlerter(overlayRef, () => {
    dismissOverlay()
  }, ['wcm-modal'])

  // Check position and show the overlay if overlay has been opened.
  useEffect(() => {
    if (open) {
      checkOverlayPosition()
    }
  }, [open])

  // Close the overlay on window resize.
  useEffect(() => {
    window.addEventListener('resize', resizeCallback)
    return () => {
      window.removeEventListener('resize', resizeCallback)
    }
  }, [])

  return (
    open && (
      <Wrapper
        ref={overlayRef}
        onAnimationComplete={() => checkOverlayPosition()}
        className="large"
        style={{
          position: 'fixed',
          left: `${x}px`,
          top: `${y}px`,
          opacity: show ? 1 : 0,
          zIndex: 50,
          width: '100%',
          maxWidth: `${CONNECT_OVERLAY_MAX_WIDTH}px`,
        }}
      >
        <motion.div
          animate={!hidden ? 'show' : 'hidden'}
          variants={{
            hidden: {
              opacity: 0,
              transform: 'scale(0.95)',
            },
            show: {
              opacity: 1,
              transform: 'scale(1)',
            },
          }}
          transition={{
            duration: TAB_TRANSITION_DURATION_MS * 0.001,
            ease: [0.1, 1, 0.1, 1],
          }}
          className="scroll"
          style={{ maxHeight: window.innerHeight - DocumentPadding * 2 }}
        >
          <div className="inner">
            <Inner installed={installed} other={other} />
          </div>
        </motion.div>
      </Wrapper>
    )
  )
}
