// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useActiveAccounts } from 'contexts/ActiveAccounts'
import { useImportedAccounts } from 'contexts/Connect/ImportedAccounts'
import { useTheme } from 'contexts/Themes'
import { useState } from 'react'
import { ButtonAccount } from 'ui-buttons'
import { ButtonRow, Popover } from 'ui-core/base'
import { useOverlay } from 'ui-overlay'
import DefaultAccount from '../Account/DefaultAccount'
import { AccountPopover } from './Popovers/AccountPopover'

export const Connected = () => {
  const { themeElementRef } = useTheme()
  const { openModal } = useOverlay().modal
  const { accountHasSigner } = useImportedAccounts()
  const { activeAccount, activeProxy } = useActiveAccounts()

  const [open, setOpen] = useState<boolean>(false)

  return (
    <>
      <Popover
        open={open}
        portalContainer={themeElementRef.current || undefined}
        content={<AccountPopover setOpen={setOpen} />}
      >
        <ButtonAccount
          activeAccount={activeAccount}
          activeProxy={activeProxy}
        />
      </Popover>
      <Popover
        open={open}
        portalContainer={themeElementRef.current || undefined}
        content={<AccountPopover setOpen={setOpen} />}
      >
        <DefaultAccount
          className="header-account"
          onClick={() => {
            if (activeAccount) {
              if (!open) {
                setOpen(true)
              }
            } else {
              openModal({ key: 'Accounts' })
            }
          }}
          value={activeAccount || ''}
          readOnly={!accountHasSigner(activeAccount)}
        />
      </Popover>
      {activeProxy && (
        <ButtonRow xMargin>
          <DefaultAccount
            value={activeProxy}
            readOnly={!accountHasSigner(activeProxy)}
          />
        </ButtonRow>
      )}
    </>
  )
}
