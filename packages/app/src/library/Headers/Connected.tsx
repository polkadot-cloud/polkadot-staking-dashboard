// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useActiveAccounts } from 'contexts/ActiveAccounts'
import { useImportedAccounts } from 'contexts/Connect/ImportedAccounts'
import { useTheme } from 'contexts/Themes'
import { useState } from 'react'
import { ButtonRow, Popover } from 'ui-core/base'
import DefaultAccount from '../Account/DefaultAccount'
import { AccountPopover } from './Popovers/AccountPopover'

export const Connected = () => {
  const { themeElementRef } = useTheme()
  const { accountHasSigner } = useImportedAccounts()
  const { activeAccount, activeProxy } = useActiveAccounts()

  const [open, setOpen] = useState<boolean>(false)

  return (
    activeAccount && (
      <>
        {/* Default account display. */}
        <Popover
          open={open}
          portalContainer={themeElementRef.current || undefined}
          content={<AccountPopover setOpen={setOpen} />}
        >
          <DefaultAccount
            className="header-account"
            onClick={() => {
              if (!open) {
                setOpen(true)
              }
            }}
            value={activeAccount}
            readOnly={!accountHasSigner(activeAccount)}
          />
        </Popover>

        {/* Proxy account display / hide if no proxy. */}
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
  )
}
