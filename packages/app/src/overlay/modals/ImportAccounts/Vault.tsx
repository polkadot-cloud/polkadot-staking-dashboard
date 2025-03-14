// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { faQrcode } from '@fortawesome/free-solid-svg-icons'
import PolkadotVaultSVG from '@w3ux/extension-assets/PolkadotVault.svg?react'
import { useVaultAccounts } from '@w3ux/react-connect-kit'
import { Polkicon } from '@w3ux/react-polkicon'
import type { VaultAccount } from '@w3ux/types'
import { useNetwork } from 'contexts/Network'
import { HardwareAddress } from 'library/HardwareAddress'
import { QrReader } from 'library/QrReader'
import { useState } from 'react'
import { ButtonText } from 'ui-buttons'
import { AccountImport } from 'ui-core/base'

export const Vault = () => {
  const {
    getVaultAccounts,
    vaultAccountExists,
    renameVaultAccount,
    removeVaultAccount,
  } = useVaultAccounts()
  const {
    network,
    networkData: { ss58 },
  } = useNetwork()

  // Whether the import account button is active.
  const [importActive, setImportActive] = useState<boolean>(false)

  const vaultAccounts = getVaultAccounts(network)

  // Handle renaming a vault address.
  const handleRename = (address: string, newName: string) => {
    renameVaultAccount(network, address, newName)
  }

  // Handle removing a vault address.
  const handleRemove = (address: string): void => {
    if (confirm('Are you sure you want to remove this account?')) {
      removeVaultAccount(network, address)
    }
  }

  return (
    <>
      <AccountImport.Header
        Logo={<PolkadotVaultSVG />}
        title="Polkadot Vault"
        websiteText="vault.novasama.io"
        websiteUrl="https://vault.novasama.io"
      >
        <span>
          <ButtonText
            text={!importActive ? 'Add Account' : 'Cancel'}
            iconLeft={faQrcode}
            onClick={() => {
              setImportActive(!importActive)
            }}
            style={{ fontSize: '1.1rem' }}
          />
        </span>
      </AccountImport.Header>

      <div>
        <QrReader
          network={network}
          ss58={ss58}
          importActive={importActive}
          onSuccess={() => {
            setImportActive(false)
          }}
        />
      </div>
      <div>
        {vaultAccounts.map(({ address, name }: VaultAccount, i) => (
          <HardwareAddress
            key={`vault_imported_${i}`}
            network={network}
            address={address}
            index={i}
            initial={name}
            Identicon={<Polkicon address={address} fontSize="2.9rem" />}
            existsHandler={vaultAccountExists}
            renameHandler={handleRename}
            onRemove={handleRemove}
            onConfirm={() => {
              /* Do nothing. Not shown in UI. */
            }}
          />
        ))}
      </div>
    </>
  )
}
