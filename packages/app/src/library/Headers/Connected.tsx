// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useActiveAccounts } from 'contexts/ActiveAccounts'
import { useImportedAccounts } from 'contexts/Connect/ImportedAccounts'
import { useTheme } from 'contexts/Themes'
import { ButtonCopy } from 'library/ButtonCopy'
import { ButtonRow, Popover } from 'ui-core/base'
import DefaultAccount from '../Account/DefaultAccount'

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
          content={
            <>
              <h4>Full Address</h4>
              <p>
                {activeAccount} &nbsp;
                <ButtonCopy value={activeAccount} size="0.95rem" />
              </p>
            </>
          }
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
