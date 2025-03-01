// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useActiveAccounts } from 'contexts/ActiveAccounts'
import { ButtonCopy } from 'library/ButtonCopy'

export const AccountPopover = () => {
  const { activeAccount } = useActiveAccounts()

  return (
    <>
      <h4>Full Address</h4>
      <p>
        {activeAccount} &nbsp;
        <ButtonCopy value={activeAccount || ''} size="0.95rem" />
      </p>
    </>
  )
}
