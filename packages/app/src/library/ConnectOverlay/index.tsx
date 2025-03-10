// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: AGPL-3.0

import extensions from '@w3ux/extension-assets'
import type { ExtensionArrayListItem } from '@w3ux/extension-assets/util'
import { useOutsideAlerter } from '@w3ux/hooks'
import { useExtensions } from '@w3ux/react-connect-kit'
import type { Dispatch, SetStateAction } from 'react'
import { useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { PopoverTab } from 'ui-buttons'
import { Inner } from './Inner'
import { mobileCheck } from './Utils'
import { Wrapper } from './Wrappers'

export const ConnectOverlay = ({
  setOpen,
}: {
  setOpen: Dispatch<SetStateAction<boolean>>
}) => {
  const { t } = useTranslation()
  const { extensionsStatus } = useExtensions()

  const popoverRef = useRef<HTMLDivElement>(null)

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

  // Close the menu if clicked outside of its container
  useOutsideAlerter(popoverRef, () => {
    setOpen(false)
  }, ['header-connect'])

  return (
    <div ref={popoverRef}>
      <PopoverTab.Container position="top">
        <PopoverTab.Button
          text={t('wallets', { ns: 'app' })}
          onClick={() => {
            /* Do nothing */
          }}
        />
        <PopoverTab.Button
          text={t('proxies', { ns: 'modals' })}
          onClick={() => {
            /* Do nothing */
          }}
        />
        <PopoverTab.Button
          text={t('readOnly', { ns: 'modals' })}
          onClick={() => {
            /* Do nothing */
          }}
        />
      </PopoverTab.Container>
      <Wrapper className="large">
        <div className="scroll">
          <div className="inner">
            <Inner installed={installed} other={other} />
          </div>
        </div>
      </Wrapper>
    </div>
  )
}
