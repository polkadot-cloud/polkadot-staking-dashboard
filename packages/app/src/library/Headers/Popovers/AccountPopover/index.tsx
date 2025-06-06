// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useOutsideAlerter } from '@w3ux/hooks'
import { ellipsisFn } from '@w3ux/utils'
import { useActiveAccounts } from 'contexts/ActiveAccounts'
import { useImportedAccounts } from 'contexts/Connect/ImportedAccounts'
import { useNetwork } from 'contexts/Network'
import { setActiveProxy } from 'global-bus'
import { useRef, type Dispatch, type SetStateAction } from 'react'
import { useTranslation } from 'react-i18next'
import { PopoverTab } from 'ui-buttons'
import { useOverlay } from 'ui-overlay'
import { Account } from './Account'

export const AccountPopover = ({
  setOpen,
}: {
  setOpen: Dispatch<SetStateAction<boolean>>
}) => {
  const { t } = useTranslation()
  const { network } = useNetwork()
  const { openModal } = useOverlay().modal
  const { getAccount } = useImportedAccounts()
  const { activeAddress, activeProxy, activeProxyType, setActiveAccount } =
    useActiveAccounts()

  const popoverRef = useRef<HTMLDivElement>(null)

  // Close the menu if clicked outside of its container
  useOutsideAlerter(popoverRef, () => {
    setOpen(false)
  }, ['header-account'])

  const account = getAccount(activeAddress)
  const name = account?.name || ''

  const accountLabel =
    activeAddress && activeAddress !== ''
      ? name || ellipsisFn(activeAddress)
      : ''

  return (
    <div ref={popoverRef} style={{ paddingTop: '1.5rem' }}>
      <Account address={activeAddress || ''} label={accountLabel} />
      {activeProxy && activeProxyType && (
        <Account
          address={activeProxy.address}
          label={`Signer (${activeProxyType} Proxy):`}
        />
      )}

      <PopoverTab.Container position="bottom" yMargin>
        <PopoverTab.Button
          text={t('switchAccount', { ns: 'app' })}
          onClick={() => {
            setOpen(false)
            openModal({ key: 'Accounts' })
          }}
        />
        <PopoverTab.Button
          status="danger"
          text={t('disconnect', { ns: 'modals' })}
          onClick={() => {
            setActiveAccount(null)
            setActiveProxy(network, null)
            setOpen(false)
          }}
        />
      </PopoverTab.Container>
    </div>
  )
}
