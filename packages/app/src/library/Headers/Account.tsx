// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useActiveAccounts } from 'contexts/ActiveAccounts'
import { useImportedAccounts } from 'contexts/Connect/ImportedAccounts'
import { useTheme } from 'contexts/Themes'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ButtonAccount } from 'ui-buttons'
import { Popover } from 'ui-core/popover'
import { useOverlay } from 'ui-overlay'
import { AccountPopover } from './Popovers/AccountPopover'

export const Account = () => {
  const { t } = useTranslation('app')
  const { themeElementRef } = useTheme()
  const { openModal } = useOverlay().modal
  const { activeAccount, activeProxy } = useActiveAccounts()
  const { accountHasSigner, getAccount, accounts } = useImportedAccounts()

  const [open, setOpen] = useState<boolean>(false)

  const totalImportedAccounts = accounts.length

  return !activeAccount ? (
    <ButtonAccount.Standalone
      label={totalImportedAccounts ? t('selectAccount') : t('connectAccounts')}
      onClick={() =>
        openModal({ key: totalImportedAccounts ? 'Accounts' : 'Connect' })
      }
    />
  ) : (
    <Popover
      open={open}
      portalContainer={themeElementRef.current || undefined}
      content={<AccountPopover setOpen={setOpen} />}
      onTriggerClick={() => {
        if (activeAccount) {
          setOpen(!open)
        } else {
          openModal({ key: 'Accounts' })
        }
      }}
    >
      <ButtonAccount.Label
        className="header-account"
        activeAccount={getAccount(activeAccount)}
        label={getAccount(activeProxy) ? t('proxy', { ns: 'app' }) : undefined}
        readOnly={!accountHasSigner(activeAccount)}
        open={open}
      />
    </Popover>
  )
}
