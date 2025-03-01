// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useActiveAccounts } from 'contexts/ActiveAccounts'
import { useImportedAccounts } from 'contexts/Connect/ImportedAccounts'
import { useTheme } from 'contexts/Themes'
import { ButtonRow, Popover } from 'ui-core/base'
import DefaultAccount from '../Account/DefaultAccount'
import { AccountPopover } from './Popovers/AccountPopover'

export const Connected = () => {
  const { themeElementRef } = useTheme()
  const { accountHasSigner } = useImportedAccounts()
  const { activeAccount, activeProxy } = useActiveAccounts()

  return (
    activeAccount && (
      <>
        {/* Default account display. */}
        <Popover
          portalContainer={themeElementRef.current || undefined}
          content={<AccountPopover />}
        >
          <DefaultAccount
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
