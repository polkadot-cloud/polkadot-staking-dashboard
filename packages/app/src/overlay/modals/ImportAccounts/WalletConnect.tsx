// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import {
  faLink,
  faRotateRight,
  faSquareMinus,
} from '@fortawesome/free-solid-svg-icons'
import WalletConnectSVG from '@w3ux/extension-assets/WalletConnect.svg?react'
import { useHardwareAccounts } from '@w3ux/react-connect-kit'
import { Polkicon } from '@w3ux/react-polkicon'
import type { HardwareAccountSource } from '@w3ux/types'
import { useOtherAccounts } from 'contexts/Connect/OtherAccounts'
import { useNetwork } from 'contexts/Network'
import { useWalletConnect } from 'contexts/WalletConnect'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ButtonText } from 'ui-buttons'
import { AccountImport } from 'ui-core/base'
import { Close, useOverlay } from 'ui-overlay'

export const WalletConnect = () => {
  const { t } = useTranslation()
  const {
    addHardwareAccount,
    getHardwareAccount,
    getHardwareAccounts,
    hardwareAccountExists,
    renameHardwareAccount,
    removeHardwareAccount,
  } = useHardwareAccounts()
  const {
    fetchAddresses,
    wcInitialized,
    wcSessionActive,
    connectProvider,
    disconnectWcSession,
    initializeWcSession,
  } = useWalletConnect()
  const { network } = useNetwork()
  const { setModalResize } = useOverlay().modal
  const { renameOtherAccount, addOtherAccounts, forgetOtherAccounts } =
    useOtherAccounts()

  const source: HardwareAccountSource = 'wallet_connect'

  // Whether the import account button is active
  const [importActive, setImportActive] = useState<boolean>(false)

  const wcAccounts = getHardwareAccounts(source, network)

  // Handle exist check for a vault address
  const handleExists = (address: string) =>
    hardwareAccountExists(source, network, address)

  // Handle renaming an address
  const handleRename = (address: string, newName: string) => {
    renameOtherAccount(address, newName)
    renameHardwareAccount(source, network, address, newName)
  }

  // Handle importing of address
  const handleImportAddresses = async () => {
    if (!wcInitialized) {
      return
    }
    setImportActive(true)

    // Fetch accounts from Wallet Connect
    const filteredAccounts = await fetchAddresses()

    // Save accounts to local storage
    filteredAccounts.forEach((address) => {
      const account = addHardwareAccount(
        source,
        network,
        address,
        wcAccounts.length
      )
      if (account) {
        addOtherAccounts([account])
      }
    })
    setImportActive(false)
  }

  // Disconnect from Wallet Connect and remove imported accounts
  const disconnectWc = async () => {
    if (confirm(t('areYouSure', { ns: 'app' }))) {
      wcAccounts.forEach(({ address }) => {
        const existingOther = getHardwareAccount(source, network, address)
        if (existingOther) {
          forgetOtherAccounts([existingOther])
        }
        removeHardwareAccount(source, network, address)
      })
      // Disconnect from Wallet Connect session
      await disconnectWcSession()
    }
  }

  // Resize modal on account length change
  useEffect(() => {
    setModalResize()
  }, [wcAccounts.length])

  return (
    <>
      <Close />
      <AccountImport.Header
        Logo={<WalletConnectSVG />}
        title="Wallet Connect"
        websiteText="reown.com"
        websiteUrl="https://reown.com"
      >
        {!wcSessionActive ? (
          <div>
            <ButtonText
              text={t('connect', { ns: 'app' })}
              iconLeft={faLink}
              onClick={async () => {
                // If client is disconnected, initialise a new client first
                if (!wcSessionActive) {
                  await connectProvider()
                }
                const newSession = await initializeWcSession()
                if (newSession) {
                  handleImportAddresses()
                }
              }}
            />
          </div>
        ) : (
          <>
            <div>
              <ButtonText
                text={
                  !wcInitialized
                    ? t('initializing', { ns: 'app' })
                    : importActive
                      ? t('cancel', { ns: 'app' })
                      : t('refreshAccounts', { ns: 'modals' })
                }
                onClick={async () => {
                  handleImportAddresses()
                }}
                iconLeft={
                  wcInitialized && !importActive ? faRotateRight : undefined
                }
              />
            </div>
            <div>
              <ButtonText
                text={t('disconnect', { ns: 'modals' })}
                iconLeft={faSquareMinus}
                onClick={async () => {
                  disconnectWc()
                }}
              />
            </div>
          </>
        )}
      </AccountImport.Header>
      <div>
        {wcAccounts.length === 0 ? (
          <AccountImport.Empty>
            <h3>{t('importedAccount', { count: 0, ns: 'modals' })}</h3>
          </AccountImport.Empty>
        ) : (
          <>
            <AccountImport.SubHeading
              text={t('importedAccount', {
                count: wcAccounts.length,
                ns: 'modals',
              })}
            />
            {wcAccounts.map(({ address, name }, i) => (
              <AccountImport.Item
                key={`wc_imported_${network}_${i}`}
                address={address}
                allowAction={false}
                last={i === wcAccounts.length - 1}
                initial={name}
                Identicon={<Polkicon address={address} fontSize="3.3rem" />}
                existsHandler={handleExists}
                renameHandler={handleRename}
                onRemove={() => {
                  // Do nothing
                }}
              />
            ))}
          </>
        )}
      </div>
    </>
  )
}
