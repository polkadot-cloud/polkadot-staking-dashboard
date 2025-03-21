// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { faUsb } from '@fortawesome/free-brands-svg-icons'
import LedgerSquareSVG from '@w3ux/extension-assets/LedgerSquare.svg?react'
import { useEffectIgnoreInitial } from '@w3ux/hooks'
import { useLedgerAccounts } from '@w3ux/react-connect-kit'
import type { LedgerAddress } from '@w3ux/react-connect-kit/types'
import { Polkicon } from '@w3ux/react-polkicon'
import type { LedgerAccount } from '@w3ux/types'
import { ellipsisFn, setStateWithRef } from '@w3ux/utils'
import { useOtherAccounts } from 'contexts/Connect/OtherAccounts'
import { useLedgerHardware } from 'contexts/LedgerHardware'
import type { LedgerResponse } from 'contexts/LedgerHardware/types'
import {
  getLedgerApp,
  getLocalLedgerAddresses,
} from 'contexts/LedgerHardware/Utils'
import { useNetwork } from 'contexts/Network'
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ButtonText } from 'ui-buttons'
import { AccountImport } from 'ui-core/base'
import { Close, useOverlay } from 'ui-overlay'

export const Ledger = () => {
  const { t } = useTranslation()
  const {
    network,
    networkData: { ss58 },
  } = useNetwork()
  const {
    addLedgerAccount,
    removeLedgerAccount,
    renameLedgerAccount,
    ledgerAccountExists,
    getLedgerAccount,
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
  const { setModalResize } = useOverlay().modal
  const { renameOtherAccount, addOtherAccounts, forgetOtherAccounts } =
    useOtherAccounts()

  // Store addresses retreived from Ledger device. Defaults to local addresses
  const [addresses, setAddresses] = useState<LedgerAccount[]>(
    getLedgerAccounts(network)
  )
  const addressesRef = useRef(addresses)

  const { txMetadataChainId } = getLedgerApp(network)

  // Get whether the ledger device is currently executing a task
  const isExecuting = getIsExecuting()

  // Handle renaming a ledger address
  const handleRename = (address: string, newName: string) => {
    renameOtherAccount(address, newName)
    renameLedgerAccount(network, address, newName)
  }

  // Handle removing a ledger address
  const handleRemove = (address: string) => {
    if (confirm(t('areYouSure', { ns: 'app' }))) {
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

      // Remove from `other` accounts state
      const existingOther = getLedgerAccount(network, address)
      if (existingOther) {
        forgetOtherAccounts([existingOther])
      }

      // Remove ledger account from state
      removeLedgerAccount(network, address)
      // Remove ledger account from state
      setStateWithRef(
        [...addressesRef.current.filter((a) => a.address !== address)],
        setAddresses,
        addressesRef
      )
    }
  }

  // Gets the next non-imported ledger address index
  const getNextAddressIndex = () => {
    if (!addressesRef.current.length) {
      return 0
    }
    return addressesRef.current[addressesRef.current.length - 1].index + 1
  }

  // Ledger address getter
  const onGetAddress = async () => {
    await handleGetAddress(txMetadataChainId, getNextAddressIndex(), ss58)
  }

  // Handle new Ledger status report
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
      setStateWithRef(
        [...addressesRef.current, ...newAddress],
        setAddresses,
        addressesRef
      )

      // Update the full list of local ledger addresses with new entry. NOTE: This can be deprecated
      // once w3ux package is updated to directly import without using local `ledger_addresses`
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
      const account = addLedgerAccount(
        network,
        newAddress[0].address,
        options.accountIndex
      )
      if (account) {
        addOtherAccounts([account])
      }
      resetStatusCode()
    }
  }

  // Resets ledger accounts
  const resetLedgerAccounts = () => {
    // Remove imported Ledger accounts.
    addressesRef.current.forEach((account) => {
      removeLedgerAccount(network, account.address)
    })
    setStateWithRef([], setAddresses, addressesRef)
  }

  // Get last saved ledger feedback
  const feedback = getFeedback()

  // Listen for new Ledger status reports
  useEffectIgnoreInitial(() => {
    handleLedgerStatusResponse(transportResponse)
  }, [transportResponse])

  // Tidy up context state when this component is no longer mounted
  useEffect(
    () => () => {
      handleUnmount()
    },
    []
  )

  // Resize modal on account length / feedback change
  useEffect(() => {
    setModalResize()
  }, [addresses.length, feedback?.message])

  const maybeFeedback = feedback?.message

  return (
    <>
      <Close />
      <AccountImport.Header
        Logo={<LedgerSquareSVG />}
        title="Ledger"
        websiteText="ledger.com"
        websiteUrl="https://ledger.com"
      >
        {addressesRef.current.length > 0 && (
          <span>
            <ButtonText
              text={'Reset'}
              onClick={() => {
                if (confirm(t('areYouSure', { ns: 'app' }))) {
                  resetLedgerAccounts()
                }
              }}
            />
          </span>
        )}
        <span>
          <ButtonText
            text={
              isExecuting
                ? t('cancel', { ns: 'app' })
                : t('importAnotherAccount', { ns: 'modals' })
            }
            iconLeft={faUsb}
            onClick={async () => {
              if (!isExecuting) {
                await onGetAddress()
              } else {
                handleResetLedgerTask()
              }
            }}
          />
        </span>
      </AccountImport.Header>
      {!!maybeFeedback && (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <h3 style={{ padding: '1rem 0 2rem 0' }}>{feedback?.message}</h3>
        </div>
      )}
      <div>
        {addresses.length === 0 && !maybeFeedback && (
          <AccountImport.Empty>
            <h3>{t('importedAccount', { count: 0, ns: 'modals' })}</h3>
          </AccountImport.Empty>
        )}
        {addresses.length > 0 && (
          <>
            <AccountImport.SubHeading
              text={t('importedAccount', {
                count: addresses.length,
                ns: 'modals',
              })}
            />
            {addresses.map(({ name, address }: LedgerAccount, i) => (
              <AccountImport.Item
                key={`ledger_imported_${i}`}
                network="polkadot"
                address={address}
                index={0}
                last={i === addresses.length - 1}
                initial={name}
                Identicon={<Polkicon address={address} fontSize="3.3rem" />}
                existsHandler={ledgerAccountExists}
                renameHandler={handleRename}
                onRemove={handleRemove}
                onConfirm={() => {
                  /* Do nothing. Not shown in UI. */
                }}
              />
            ))}
          </>
        )}
      </div>
    </>
  )
}
