// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { faQrcode } from '@fortawesome/free-solid-svg-icons'
import PolkadotVaultSVG from '@w3ux/extension-assets/PolkadotVault.svg?react'
import { useVaultAccounts } from '@w3ux/react-connect-kit'
import { Polkicon } from '@w3ux/react-polkicon'
import type { VaultAccount } from '@w3ux/types'
import { useOtherAccounts } from 'contexts/Connect/OtherAccounts'
import { useNetwork } from 'contexts/Network'
import { QrReader } from 'library/QrReader'
import type { CSSProperties } from 'react'
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ButtonSubmitInvert, ButtonText } from 'ui-buttons'
import { AccountImport } from 'ui-core/base'
import { Close, useOverlay } from 'ui-overlay'

export const Vault = () => {
  const { t } = useTranslation()
  const {
    network,
    networkData: { ss58 },
  } = useNetwork()
  const {
    getVaultAccount,
    getVaultAccounts,
    vaultAccountExists,
    renameVaultAccount,
    removeVaultAccount,
  } = useVaultAccounts()
  const { setModalResize } = useOverlay().modal
  const { renameOtherAccount, addOtherAccounts, forgetOtherAccounts } =
    useOtherAccounts()

  // Whether the import account button is active
  const [importActive, setImportActive] = useState<boolean>(false)

  // Get vault accounts
  const vaultAccounts = getVaultAccounts(network)

  // Handle renaming a vault address
  const handleRename = (address: string, newName: string) => {
    renameOtherAccount(address, newName)
    renameVaultAccount(network, address, newName)
  }

  // Handle removing a vault address
  const handleRemove = (address: string): void => {
    if (confirm(t('areYouSure', { ns: 'app' }))) {
      const existingOther = getVaultAccount(network, address)
      if (existingOther) {
        forgetOtherAccounts([existingOther])
      }
      removeVaultAccount(network, address)
    }
  }

  // Account container ref
  const accountsRef = useRef<HTMLDivElement>(null)
  const [accountsHeight, setAccountsHeight] = useState(0)

  useEffect(() => {
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.contentRect) {
          setAccountsHeight(entry.contentRect.height)
        }
      }
    })
    if (accountsRef.current) {
      observer.observe(accountsRef.current)
    }
    return () => {
      observer.disconnect()
    }
  }, [])

  // Resize modal on importActive change
  useEffect(() => {
    setModalResize()
  }, [vaultAccounts.length, accountsHeight])

  // Accounts container style depending on whether import is active
  const accountsStyle: CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-end',
    minHeight: importActive ? '20rem' : 0,
    opacity: importActive ? 0.1 : 1,
    transition: 'all 0.2s',
  }

  return (
    <>
      {importActive ? <AccountImport.Inactive /> : <Close />}
      <AccountImport.Header
        Logo={<PolkadotVaultSVG />}
        title="Polkadot Vault"
        websiteText="vault.novasama.io"
        websiteUrl="https://vault.novasama.io"
      >
        <span>
          <ButtonText
            text={
              !importActive
                ? t('addAccount ', { ns: 'app' })
                : t('cancel', { ns: 'app' })
            }
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
            top: '9.2rem',
            left: 0,
            width: '100%',
            zIndex: 9,
          }}
        >
          <QrReader
            network={network}
            ss58={ss58}
            onSuccess={(account) => {
              addOtherAccounts([account])
              setImportActive(false)
            }}
          />
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <ButtonSubmitInvert
              text="Cancel"
              onClick={() => setImportActive(false)}
            />
          </div>
        </div>
      )}
      <div ref={accountsRef} style={{ ...accountsStyle }}>
        {vaultAccounts.length === 0 && (
          <AccountImport.Empty>
            <h3>{t('noVaultAccountsImported', { ns: 'modals' })}</h3>
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
