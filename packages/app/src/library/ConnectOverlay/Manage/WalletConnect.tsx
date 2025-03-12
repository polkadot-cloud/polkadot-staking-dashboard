// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: AGPL-3.0

import { faLink, faSquareMinus } from '@fortawesome/free-solid-svg-icons'
import { useEffectIgnoreInitial } from '@w3ux/hooks'
import { useWcAccounts } from '@w3ux/react-connect-kit'
import { Polkicon } from '@w3ux/react-polkicon'
import type { WCAccount } from '@w3ux/types'
import { useNetwork } from 'contexts/Network'
import { useWalletConnect } from 'contexts/WalletConnect'
import { motion } from 'framer-motion'
import { useState } from 'react'
import { ButtonText } from 'ui-buttons'
import { ConnectItem } from 'ui-core/popover'
import type { ManageHardwareProps } from '../types'
import { HardwareAddress } from './HardwareAddress'

export const WalletConnect = ({
  getMotionProps,
  selectedConnectItem,
}: ManageHardwareProps) => {
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

  // Resets UI when the selected connect item changes from `wallet_connect`, Cancelling import and
  // search if active.
  useEffectIgnoreInitial(() => {
    if (selectedConnectItem !== 'wallet_connect') {
      setImportActive(false)
    }
  }, [selectedConnectItem])

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
      <motion.div {...getMotionProps('address_config')}>
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
      </motion.div>

      <motion.div {...getMotionProps('address')}>
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
      </motion.div>
    </>
  )
}
