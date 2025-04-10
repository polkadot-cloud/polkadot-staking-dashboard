// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { faQrcode } from '@fortawesome/free-solid-svg-icons'
import PolkadotVaultSVG from '@w3ux/extension-assets/PolkadotVault.svg?react'
import { useHardwareAccounts } from '@w3ux/react-connect-kit'
import { Polkicon } from '@w3ux/react-polkicon'
import type { AccountSource } from '@w3ux/types'
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
    getHardwareAccount,
    getHardwareAccounts,
    hardwareAccountExists,
    renameHardwareAccount,
    removeHardwareAccount,
  } = useHardwareAccounts()
  const { setModalResize } = useOverlay().modal
  const { renameOtherAccount, addOtherAccounts, forgetOtherAccounts } =
    useOtherAccounts()

  const source: AccountSource = 'vault'

  // Whether the import account button is active
  const [importActive, setImportActive] = useState<boolean>(false)

  // Get vault accounts
  const vaultAccounts = getHardwareAccounts(source, network)

  // Handle exist check for a vault address
  const handleExists = (address: string) =>
    hardwareAccountExists(source, network, address)

  // Handle renaming a vault address
  const handleRename = (address: string, newName: string) => {
    renameOtherAccount(address, newName)
    renameHardwareAccount(source, network, address, newName)
  }

  // Handle removing a vault address
  const handleRemove = (address: string): void => {
    if (confirm(t('areYouSure', { ns: 'app' }))) {
      const existingOther = getHardwareAccount(source, network, address)
      if (existingOther) {
        forgetOtherAccounts([existingOther])
      }
      removeHardwareAccount(source, network, address)
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
                ? t('addAccount', { ns: 'app' })
                : t('cancel', { ns: 'app' })
            }
            iconLeft={faQrcode}
            onClick={() => {
              setImportActive(!importActive)
            }}
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
              text={t('cancel', { ns: 'app' })}
              onClick={() => setImportActive(false)}
            />
          </div>
        </div>
      )}
      <div ref={accountsRef} style={{ ...accountsStyle }}>
        {vaultAccounts.length === 0 ? (
          <AccountImport.Empty>
            <h3>{t('importedAccount', { count: 0, ns: 'modals' })}</h3>
          </AccountImport.Empty>
        ) : (
          <>
            <AccountImport.SubHeading
              text={t('importedAccount', {
                ns: 'modals',
                count: vaultAccounts.length,
              })}
            />
            {vaultAccounts.map(({ address, name }, i) => (
              <AccountImport.Item
                key={`vault_imported_${i}`}
                address={address}
                initial={name}
                last={i === vaultAccounts.length - 1}
                Identicon={<Polkicon address={address} fontSize="3.3rem" />}
                existsHandler={handleExists}
                renameHandler={handleRename}
                onRemove={handleRemove}
              />
            ))}
          </>
        )}
      </div>
    </>
  )
}
