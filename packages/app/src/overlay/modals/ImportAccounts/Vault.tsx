// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { faQrcode } from '@fortawesome/free-solid-svg-icons'
import PolkadotVaultSVG from '@w3ux/extension-assets/PolkadotVault.svg?react'
import { useVaultAccounts } from '@w3ux/react-connect-kit'
import { Polkicon } from '@w3ux/react-polkicon'
import type { VaultAccount } from '@w3ux/types'
import { useNetwork } from 'contexts/Network'
import { QrReader } from 'library/QrReader'
import { useEffect, useRef, useState } from 'react'
import { ButtonText } from 'ui-buttons'
import { AccountImport } from 'ui-core/base'
import { Close, useOverlay } from 'ui-overlay'

export const Vault = () => {
  const {
    network,
    networkData: { ss58 },
  } = useNetwork()
  const {
    getVaultAccounts,
    vaultAccountExists,
    renameVaultAccount,
    removeVaultAccount,
  } = useVaultAccounts()
  const { setModalResize } = useOverlay().modal

  // Whether the import account button is active
  const [importActive, setImportActive] = useState<boolean>(false)

  // Get vault accounts
  const vaultAccounts = getVaultAccounts(network)

  // Handle renaming a vault address
  const handleRename = (address: string, newName: string) => {
    renameVaultAccount(network, address, newName)
  }

  // Handle removing a vault address
  const handleRemove = (address: string): void => {
    if (confirm('Are you sure you want to remove this account?')) {
      removeVaultAccount(network, address)
    }
  }

  // Account container ref
  const accountsContainerRef = useRef<HTMLDivElement>(null)

  // Resize modal on importActive change
  useEffect(() => {
    setModalResize()
  }, [importActive, vaultAccounts.length])

  return (
    <>
      <Close />
      {importActive && (
        <AccountImport.Dismiss onClick={() => setImportActive(false)} />
      )}
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

      {importActive && (
        <div
          style={{
            position: 'absolute',
            top: '5rem',
            left: 0,
            width: '100%',
            zIndex: 9,
          }}
          onClick={() => setImportActive(false)}
        >
          <QrReader
            network={network}
            ss58={ss58}
            onSuccess={() => {
              setImportActive(false)
            }}
          />
        </div>
      )}
      <div
        ref={accountsContainerRef}
        style={{
          marginTop: importActive ? '10rem' : 0,
          opacity: importActive ? 0.25 : 1,
          transition: 'all 0.2s',
        }}
      >
        {vaultAccounts.length === 0 && (
          <AccountImport.Empty>
            <h3>No Accounts Imported</h3>
          </AccountImport.Empty>
        )}
        {vaultAccounts.map(({ address, name }: VaultAccount, i) => (
          <AccountImport.Item
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
