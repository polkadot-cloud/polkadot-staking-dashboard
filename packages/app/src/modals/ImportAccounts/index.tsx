// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useOverlay } from 'ui-overlay'
import { Ledger } from './Ledger'
import { Vault } from './Vault'
import { WalletConnect } from './WalletConnect'

export const ImportAccounts = () => {
  const { config } = useOverlay().modal
  const { source } = config.options

  switch (source) {
    case 'polkadot_vault':
      return <Vault />
    case 'ledger':
      return <Ledger />
    case 'wallet_connect':
      return <WalletConnect />
    default:
      return null
  }
}
