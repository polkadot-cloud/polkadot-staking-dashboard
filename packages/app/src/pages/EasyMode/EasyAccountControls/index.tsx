// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useActiveAccounts } from 'contexts/ActiveAccounts'
import { EasyItem } from './EasyItem'
import { EasyActiveAccountsWrapper } from './Wrappers'

export const EasyAccountControls = () => {
  const { activeProxy, activeAccount } = useActiveAccounts()

  return (
    <EasyActiveAccountsWrapper>
      <EasyItem address={activeAccount} />
      {activeProxy && (
        <EasyItem address={activeAccount} delegate={activeProxy} />
      )}
    </EasyActiveAccountsWrapper>
  )
}

export default EasyAccountControls
