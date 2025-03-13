// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: AGPL-3.0

import extensions from '@w3ux/extension-assets'
import type { ExtensionArrayListItem } from '@w3ux/extension-assets/util'
import { useOutsideAlerter } from '@w3ux/hooks'
import { useExtensions } from '@w3ux/react-connect-kit'
import { motion } from 'framer-motion'
import type { Dispatch, SetStateAction } from 'react'
import { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { PopoverTab } from 'ui-buttons'
import { ConnectItem } from 'ui-core/popover'
import { Inner } from './Inner'
import { mobileCheck } from './Utils'

export const ConnectOverlay = ({
  setOpen,
}: {
  setOpen: Dispatch<SetStateAction<boolean>>
}) => {
  const { t } = useTranslation()
  const { extensionsStatus } = useExtensions()

  // Store the active hardware wallet, if selected.
  const [selectedSection, setSelectedConnectItem] = useState<string>('wallets')

  const popoverRef = useRef<HTMLDivElement>(null)

  // Whether the app is running on mobile.
  const isMobile = mobileCheck()

  // Whether the app is running in Nova Wallet.
  const inNova = !!window?.walletExtension?.isNovaWallet || false

  // Whether the app is running in a SubWallet Mobile.
  const inSubWallet = !!window.injectedWeb3?.['subwallet-js'] && isMobile

  // Format supported extensions as array.
  const extensionsAsArray = Object.entries(extensions).map(([key, value]) => ({
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

  // Close the menu if clicked outside of its container
  useOutsideAlerter(popoverRef, () => {
    setOpen(false)
  }, ['header-connect'])

  const variants = {
    hidden: {
      height: 0,
      opacity: 0,
    },
    show: {
      height: 'auto',
      opacity: 1,
    },
  }

  // Gets framer motion props for a management ui item.
  const getManageProps = (item: string, initial: 'show' | 'hidden') => ({
    initial,
    variants,
    transition: {
      duration: 0.2,
    },
    animate: selectedSection === item ? 'show' : 'hidden',
    className: 'motion',
  })

  return (
    <div ref={popoverRef}>
      <PopoverTab.Container position="top">
        <PopoverTab.Button
          text={t('wallets', { ns: 'app' })}
          onClick={() => setSelectedConnectItem('wallets')}
        />
        <PopoverTab.Button
          text={t('proxies', { ns: 'modals' })}
          onClick={() => setSelectedConnectItem('proxies')}
        />
        <PopoverTab.Button
          text={t('readOnly', { ns: 'modals' })}
          onClick={() => setSelectedConnectItem('readOnly')}
        />
      </PopoverTab.Container>
      <motion.section {...getManageProps('wallets', 'show')}>
        <ConnectItem.Container>
          <Inner
            installed={installed}
            other={other}
            selectedSection={selectedSection}
            setOpen={setOpen}
          />
        </ConnectItem.Container>
      </motion.section>
      <motion.section {...getManageProps('proxies', 'hidden')}>
        <ConnectItem.Container>
          <h4>Proxies</h4>
        </ConnectItem.Container>
      </motion.section>
      <motion.section {...getManageProps('readOnly', 'hidden')}>
        <ConnectItem.Container>
          <h4>Read Only</h4>
        </ConnectItem.Container>
      </motion.section>
    </div>
  )
}
