// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import LedgerSquareSVG from '@w3ux/extension-assets/LedgerSquare.svg?react'
import PolkadotVaultSVG from '@w3ux/extension-assets/PolkadotVault.svg?react'
import WalletConnectSVG from '@w3ux/extension-assets/WalletConnect.svg?react'
import { useOverlay } from 'ui-overlay'
import { Extension } from './Extension'
import { Hardware } from './Hardware'
import type { InnerProps } from './types'

export const Inner = ({
  installed,
  other,
  setOpen,
  selectedSection,
}: InnerProps) => {
  const { openModal } = useOverlay().modal

  const extensionItems = installed.concat(other)

  // TODO: Separate Polkadot JS as a developer tool. use `modals.developerTools` locale key as header.

  return (
    <>
      <h4>Hardware</h4>
      <section>
        <Hardware
          active={selectedSection === 'polkadot_vault'}
          onClick={() => {
            openModal({
              key: 'ImportAccounts',
              size: 'sm',
              options: { source: 'polkadot_vault' },
            })
            setOpen(false)
          }}
          Svg={PolkadotVaultSVG}
          title="Polkadot Vault"
          websiteUrl="https://vault.novasama.io"
          websiteText="vault.novasama.io"
        />
      </section>
      <section>
        <Hardware
          active={selectedSection === 'ledger'}
          onClick={() => {
            openModal({
              key: 'ImportAccounts',
              size: 'sm',
              options: { source: 'ledger' },
            })
            setOpen(false)
          }}
          Svg={LedgerSquareSVG}
          title="Ledger"
          websiteUrl="https://ledger.com"
          websiteText="ledger.com"
        />
      </section>
      <section>
        <Hardware
          active={selectedSection === 'wallet_connect'}
          onClick={() => {
            openModal({
              key: 'ImportAccounts',
              size: 'sm',
              options: { source: 'polkadot_vault' },
            })
            setOpen(false)
          }}
          Svg={WalletConnectSVG}
          title="Wallet Connect"
          websiteUrl="https://reown.com"
          websiteText="reown.com"
        />
      </section>
      <h4>Web Extensions</h4>
      {extensionItems.map((extension, i) => (
        <section key={`extension_item_${extension.id}`}>
          <Extension
            extension={extension}
            last={i === extensionItems.length - 1}
          />
        </section>
      ))}
    </>
  )
}
