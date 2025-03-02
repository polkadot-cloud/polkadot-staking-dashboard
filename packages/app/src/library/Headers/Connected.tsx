// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useActiveAccounts } from 'contexts/ActiveAccounts'
import { useImportedAccounts } from 'contexts/Connect/ImportedAccounts'
import { useTheme } from 'contexts/Themes'
import { useState } from 'react'
import { ButtonAccount } from 'ui-buttons'
import { ButtonRow } from 'ui-core/base'
import { Popover } from 'ui-core/popover'
import { useOverlay } from 'ui-overlay'
import DefaultAccount from '../Account/DefaultAccount'
import { AccountPopover } from './Popovers/AccountPopover'

export const Connected = () => {
  const { themeElementRef } = useTheme()
  const { openModal } = useOverlay().modal
  const { activeAccount, activeProxy } = useActiveAccounts()
  const { accountHasSigner, getAccount } = useImportedAccounts()

  const [open, setOpen] = useState<boolean>(false)

  return (
    <>
      <Popover
        open={open}
        portalContainer={themeElementRef.current || undefined}
        content={<AccountPopover setOpen={setOpen} />}
        onTriggerClick={() => {
          if (activeAccount) {
            if (!open) {
              setOpen(true)
            }
          } else {
            openModal({ key: 'Accounts' })
          }
        }}
      >
        <ButtonAccount
          className="header-account"
          activeAccount={getAccount(activeAccount)}
          activeProxy={getAccount(activeProxy)}
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
