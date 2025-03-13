// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: AGPL-3.0

import { faUsb } from '@fortawesome/free-brands-svg-icons'
import { useEffectIgnoreInitial } from '@w3ux/hooks'
import { useLedgerAccounts } from '@w3ux/react-connect-kit'
import type { LedgerAddress } from '@w3ux/react-connect-kit/types'
import { Polkicon } from '@w3ux/react-polkicon'
import type { LedgerAccount } from '@w3ux/types'
import { ellipsisFn, setStateWithRef } from '@w3ux/utils'
import { useLedgerHardware } from 'contexts/LedgerHardware'
import type { LedgerResponse } from 'contexts/LedgerHardware/types'
import {
  getLedgerApp,
  getLocalLedgerAddresses,
} from 'contexts/LedgerHardware/Utils'
import { useNetwork } from 'contexts/Network'
import { HardwareAddress } from 'library/HardwareAddress'
import { useEffect, useRef, useState } from 'react'
import { ButtonText } from 'ui-buttons'
import { ConnectItem } from 'ui-core/popover'

export const Ledger = () => {
  const {
    network,
    networkData: { ss58 },
  } = useNetwork()
  const {
    addLedgerAccount,
    removeLedgerAccount,
    renameLedgerAccount,
    ledgerAccountExists,
    getLedgerAccounts,
  } = useLedgerAccounts()
  const {
    getFeedback,
    setStatusCode,
    handleUnmount,
    getIsExecuting,
    resetStatusCode,
    handleGetAddress,
    transportResponse,
    handleResetLedgerTask,
  } = useLedgerHardware()

  // Store addresses retreived from Ledger device. Defaults to local addresses.
  const [addresses, setAddresses] = useState<LedgerAccount[]>(
    getLedgerAccounts(network)
  )
  const addressesRef = useRef(addresses)

  const { txMetadataChainId } = getLedgerApp(network)

  // Get whether the ledger device is currently executing a task.
  const isExecuting = getIsExecuting()

  // Handle renaming a ledger address.
  const handleRename = (address: string, newName: string) => {
    renameLedgerAccount(network, address, newName)
  }

  // Handle removing a ledger address.
  const handleRemove = (address: string) => {
    if (confirm('Are you sure you want to remove this account?')) {
      // Remove local ledger accounts.
      let newLedgerAddresses = getLocalLedgerAddresses()

      newLedgerAddresses = newLedgerAddresses.filter((a) => {
        if (a.address !== address) {
          return true
        }
        if (a.network !== network) {
          return true
        }
        return false
      })
      if (!newLedgerAddresses.length) {
        localStorage.removeItem('ledger_addresses')
      } else {
        localStorage.setItem(
          'ledger_addresses',
          JSON.stringify(newLedgerAddresses)
        )
      }

      // Remove ledger account from state.
      removeLedgerAccount(network, address)

      // Add ledger account to local state.
      setStateWithRef(
        [...addressesRef.current.filter((a) => a.address !== address)],
        setAddresses,
        addressesRef
      )
    }
  }

  // Gets the next non-imported ledger address index.
  const getNextAddressIndex = () => {
    if (!addressesRef.current.length) {
      return 0
    }
    return addressesRef.current[addressesRef.current.length - 1].index + 1
  }

  // Ledger address getter.
  const onGetAddress = async () => {
    await handleGetAddress(txMetadataChainId, getNextAddressIndex(), ss58)
  }

  // Handle new Ledger status report.
  const handleLedgerStatusResponse = (response: LedgerResponse) => {
    if (!response) {
      return
    }

    const { ack, statusCode, body, options } = response
    setStatusCode(ack, statusCode)

    if (statusCode === 'ReceivedAddress') {
      const newAddress = body.map(({ pubKey, address }: LedgerAddress) => ({
        index: options.accountIndex,
        pubKey,
        address,
        name: ellipsisFn(address),
        network,
      }))

      // Add ledger account to local state.
      setStateWithRef(
        [...addressesRef.current, ...newAddress],
        setAddresses,
        addressesRef
      )

      // Update the full list of local ledger addresses with new entry. NOTE: This can be deprecated
      // once w3ux package is updated to directly import without using local `ledger_addresses`.
      const newAddresses = getLocalLedgerAddresses()
        .filter((a) => {
          if (a.address !== newAddress[0].address) {
            return true
          }
          if (a.network !== network) {
            return true
          }
          return false
        })
        .concat(newAddress)
      localStorage.setItem('ledger_addresses', JSON.stringify(newAddresses))

      // Add new Ledger account to imported accounts.
      addLedgerAccount(network, newAddress[0].address, options.accountIndex)

      // Reset device status code.
      resetStatusCode()
    }
  }

  // Resets ledger accounts.
  const resetLedgerAccounts = () => {
    // Remove imported Ledger accounts.
    addressesRef.current.forEach((account) => {
      removeLedgerAccount(network, account.address)
    })

    setStateWithRef([], setAddresses, addressesRef)
  }

  // Get last saved ledger feedback.
  const feedback = getFeedback()

  // Listen for new Ledger status reports.
  useEffectIgnoreInitial(() => {
    handleLedgerStatusResponse(transportResponse)
  }, [transportResponse])

  // Tidy up context state when this component is no longer mounted.
  useEffect(
    () => () => {
      handleUnmount()
    },
    []
  )

  return (
    <>
      <div>
        <ConnectItem.Heading text="Ledger">
          {addressesRef.current.length > 0 && (
            <ButtonText
              text={'Reset'}
              onClick={() => {
                if (
                  confirm(
                    'Are you sure you want to remove all ledger accounts?'
                  )
                ) {
                  resetLedgerAccounts()
                }
              }}
              style={{ fontSize: '1.1rem' }}
            />
          )}
          <ButtonText
            text={isExecuting ? 'Cancel Import' : 'Import Next Account'}
            iconLeft={faUsb}
            onClick={async () => {
              if (!isExecuting) {
                await onGetAddress()
              } else {
                handleResetLedgerTask()
              }
            }}
            style={{ fontSize: '1.1rem' }}
          />
        </ConnectItem.Heading>
        <h4 style={{ padding: '1rem' }}>
          {feedback?.message ||
            `${addressesRef.current.length || 'No'} ${addressesRef.current.length === 1 ? 'Account' : 'Accounts'}`}
        </h4>
      </div>
      <div>
        {addressesRef.current.map(({ name, address }: LedgerAccount, i) => (
          <HardwareAddress
            key={`ledger_imported_${i}`}
            network="polkadot"
            address={address}
            index={0}
            initial={name}
            Identicon={<Polkicon address={address} fontSize="2.1rem" />}
            existsHandler={ledgerAccountExists}
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
