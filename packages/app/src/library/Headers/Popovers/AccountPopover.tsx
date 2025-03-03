// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useOutsideAlerter } from '@w3ux/hooks'
import { ellipsisFn } from '@w3ux/utils'
import { useActiveAccounts } from 'contexts/ActiveAccounts'
import { useImportedAccounts } from 'contexts/Connect/ImportedAccounts'
import { useRef, type Dispatch, type SetStateAction } from 'react'
import { useTranslation } from 'react-i18next'
import { ButtonText } from 'ui-buttons'
import { ButtonRow } from 'ui-core/base'
import { Padding } from 'ui-core/popover'
import { useOverlay } from 'ui-overlay'
import { Account } from './Account'

export const AccountPopover = ({
  setOpen,
}: {
  setOpen: Dispatch<SetStateAction<boolean>>
}) => {
  const { t } = useTranslation()
  const { openModal } = useOverlay().modal
  const {
    activeAccount,
    activeProxy,
    activeProxyType,
    setActiveAccount,
    setActiveProxy,
  } = useActiveAccounts()
  const { getAccount } = useImportedAccounts()

  const popoverRef = useRef<HTMLDivElement>(null)

  // Close the menu if clicked outside of its container
  useOutsideAlerter(popoverRef, () => {
    setOpen(false)
  }, ['header-account'])

  const account = getAccount(activeAccount)
  const name = account?.name || ''

  const accountLabel =
    activeAccount && activeAccount !== ''
      ? name || ellipsisFn(activeAccount)
      : ''

  return (
    <div ref={popoverRef} style={{ padding: '1.5rem 0 0.75rem 0' }}>
      <Account address={activeAccount || ''} label={accountLabel} />
      {activeProxy && activeProxyType && (
        <Account
          address={activeProxy}
          label={`Signer (${activeProxyType} Proxy):`}
        />
      )}
      <Padding flex>
        <ButtonRow>
          <ButtonText
            marginRight
            text="Switch Account"
            onClick={() => {
              setOpen(false)
              openModal({ key: 'Accounts' })
            }}
          />
          <span style={{ color: 'var(--text-color-tertiary)' }}>|</span>
          <ButtonText
            status="danger"
            marginLeft
            text={t('disconnect', { ns: 'modals' })}
            onClick={() => {
              setActiveAccount(null)
              setActiveProxy(null)
              setOpen(false)
            }}
          />
        </ButtonRow>
      </Padding>
    </div>
  )
}
