// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { faLink, faSquareMinus } from '@fortawesome/free-solid-svg-icons'
import { useWcAccounts } from '@w3ux/react-connect-kit'
import { Polkicon } from '@w3ux/react-polkicon'
import type { WCAccount } from '@w3ux/types'
import { useNetwork } from 'contexts/Network'
import { useWalletConnect } from 'contexts/WalletConnect'
import { HardwareAddress } from 'library/HardwareAddress'
import { useState } from 'react'
import { ButtonText } from 'ui-buttons'
import { ConnectItem } from 'ui-core/popover'

export const WalletConnect = () => {
  const {
    addWcAccount,
    getWcAccounts,
    wcAccountExists,
    renameWcAccount,
    removeWcAccount,
  } = useWcAccounts()
  const {
    fetchAddresses,
    wcInitialized,
    wcSessionActive,
    connectProvider,
    disconnectWcSession,
    initializeWcSession,
  } = useWalletConnect()
  const { network } = useNetwork()

  // Whether the import account button is active.
  const [importActive, setImportActive] = useState<boolean>(false)

  const wcAccounts = getWcAccounts(network)

  // Handle renaming an address.
  const handleRename = (address: string, newName: string) => {
    renameWcAccount(network, address, newName)
  }

  // Handle importing of address.
  const handleImportAddresses = async () => {
    if (!wcInitialized) {
      return
    }
    setImportActive(true)

    // Fetch accounts from Wallet Connect.
    const filteredAccounts = await fetchAddresses()

    // Save accounts to local storage.
    filteredAccounts.forEach((address) => {
      addWcAccount(network, address, wcAccounts.length)
    })

    setImportActive(false)
  }

  // Disconnect from Wallet Connect and remove imported accounts.
  const disconnectWc = async () => {
    if (confirm('Are you sure you want to disconnect from Wallet Connect?')) {
      // Remove imported Wallet Connect accounts.
      wcAccounts.forEach((account) => {
        removeWcAccount(network, account.address)
      })

      // Disconnect from Wallet Connect session.
      await disconnectWcSession()
    }
  }

  return (
    <>
      <div>
        <ConnectItem.Heading
          text={
            !wcSessionActive
              ? 'Wallet Connect is Disconnected'
              : !importActive
                ? `${
                    wcAccounts.length || 'No'
                  } ${wcAccounts.length === 1 ? 'Account' : 'Accounts'}`
                : 'New Account'
          }
        >
          {!wcSessionActive ? (
            <ButtonText
              text={'Connect'}
              iconLeft={faLink}
              onClick={async () => {
                // If client is disconnected, initialise a new client first.
                if (!wcSessionActive) {
                  await connectProvider()
                }
                const newSession = await initializeWcSession()
                if (newSession) {
                  handleImportAddresses()
                }
              }}
              style={{ fontSize: '1.1rem' }}
            />
          ) : (
            <>
              <ButtonText
                text={
                  !wcInitialized
                    ? 'Initialising'
                    : importActive
                      ? 'Cancel'
                      : 'Refresh'
                }
                onClick={async () => {
                  handleImportAddresses()
                }}
                style={{ fontSize: '1.1rem' }}
              />
              <ButtonText
                text={'Disconnect'}
                iconLeft={faSquareMinus}
                onClick={async () => {
                  disconnectWc()
                }}
                style={{ fontSize: '1.1rem' }}
              />
            </>
          )}
        </ConnectItem.Heading>
      </div>

      <div>
        {wcAccounts.map(({ address, name }: WCAccount, i) => (
          <HardwareAddress
            key={`wc_imported_${network}_${i}`}
            network={network}
            address={address}
            index={i}
            initial={name}
            Identicon={<Polkicon address={address} fontSize="2.1rem" />}
            allowAction={false}
            existsHandler={wcAccountExists}
            renameHandler={handleRename}
            onRemove={() => {
              // Do nothing.
            }}
            onConfirm={() => {
              /* Do nothing. Not shown in UI. */
            }}
          />
        ))}
      </div>
    </>
  )
}
