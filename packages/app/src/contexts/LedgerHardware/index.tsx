// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { createSafeContext } from '@w3ux/hooks'
import type { AnyJson, MaybeString } from '@w3ux/types'
import { setStateWithRef } from '@w3ux/utils'
import { compare } from 'compare-versions'
import { useApi } from 'contexts/Api'
import type { ReactNode } from 'react'
import { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { getLedgerErrorType } from './Utils'
import { defaultFeedback } from './defaults'
import { Ledger } from './static/ledger'
import type {
  FeedbackMessage,
  HandleErrorFeedback,
  LedgerHardwareContextInterface,
  LedgerResponse,
  LedgerStatusCode,
} from './types'

export const [LedgerHardwareContext, useLedgerHardware] =
  createSafeContext<LedgerHardwareContextInterface>()

export const LedgerHardwareProvider = ({
  children,
}: {
  children: ReactNode
}) => {
  const { t } = useTranslation('modals')
  const { chainSpecs } = useApi()
  const { transactionVersion } = chainSpecs

  // Store whether a Ledger device task is in progress
  const [isExecuting, setIsExecutingState] = useState<boolean>(false)
  const isExecutingRef = useRef(isExecuting)
  const getIsExecuting = () => isExecutingRef.current
  const setIsExecuting = (val: boolean) =>
    setStateWithRef(val, setIsExecutingState, isExecutingRef)

  // Store the latest status code received from a Ledger device
  const [statusCode, setStatusCodeState] = useState<LedgerResponse | null>(null)
  const statusCodeRef = useRef<LedgerResponse | null>(statusCode)
  const getStatusCode = () => statusCodeRef.current
  const setStatusCode = (ack: string, newStatusCode: LedgerStatusCode) => {
    setStateWithRef(
      { ack, statusCode: newStatusCode },
      setStatusCodeState,
      statusCodeRef
    )
  }
  const resetStatusCode = () =>
    setStateWithRef(null, setStatusCodeState, statusCodeRef)

  // Store the feedback message to display as the Ledger device is being interacted with
  const [feedback, setFeedbackState] =
    useState<FeedbackMessage>(defaultFeedback)
  const feedbackRef = useRef(feedback)
  const getFeedback = () => feedbackRef.current
  const setFeedback = (message: MaybeString, helpKey: MaybeString = null) =>
    setStateWithRef({ message, helpKey }, setFeedbackState, feedbackRef)
  const resetFeedback = () =>
    setStateWithRef(defaultFeedback, setFeedbackState, feedbackRef)

  // Set feedback message and status code together
  const setStatusFeedback = ({
    code,
    helpKey,
    message,
  }: HandleErrorFeedback) => {
    setStatusCode('failure', code)
    setFeedback(message, helpKey)
  }

  // Stores whether the Ledger device version has been checked. Used when signing transactions, not
  // when addresses are being imported
  const [integrityChecked, setIntegrityChecked] = useState<boolean>(false)

  // Store the latest successful device response
  const [transportResponse, setTransportResponse] = useState<AnyJson>(null)

  // Whether the Ledger device metadata is for a different runtime
  const runtimesInconsistent = useRef<boolean>(false)

  // Checks whether runtime version is inconsistent with device metadata
  const checkRuntimeVersion = async (txMetadataChainId: string) => {
    try {
      setIsExecuting(true)
      const { app } = await Ledger.initialise(txMetadataChainId)
      const result = await Ledger.getVersion(app)
      const major = result?.major || 0
      const minor = result?.minor || 0
      const patch = result?.major || 0

      // The current version of the Polkadot Ledger app
      const currentSemVer = `${major}.${minor}.${patch}`

      // The version the Generic Polkadot Ledger app was introduced
      const genericLaunchSemVer = '100.0.5'

      // Check if the current version is upgraded for the Generic Polkadot Ledger app
      const isLegacy = compare(currentSemVer, genericLaunchSemVer, '<')

      setIsExecuting(false)
      resetFeedback()

      // If the current version is less than the transaction version, or the app is not the generic
      // app, set the runtimesInconsistent flag
      if (major < transactionVersion || isLegacy) {
        runtimesInconsistent.current = true
      }
      setIntegrityChecked(true)
    } catch (err) {
      handleErrors(err)
    }
  }

  // Gets an address from Ledger device
  const handleGetAddress = async (
    txMetadataChainId: string,
    accountIndex: number,
    ss58Prefix: number
  ) => {
    try {
      setIsExecuting(true)
      const { app, productName } = await Ledger.initialise(txMetadataChainId)
      const result = await Ledger.getAddress(app, accountIndex, ss58Prefix)

      setIsExecuting(false)
      setFeedback(t('successfullyFetchedAddress'))
      setTransportResponse({
        ack: 'success',
        statusCode: 'ReceivedAddress',
        options: {
          accountIndex,
        },
        device: { productName },
        body: [result],
      })
    } catch (err) {
      handleErrors(err)
    }
  }

  // Signs a payload on Ledger device
  const handleSignTx = async (
    txMetadataChainId: string,
    uid: number,
    index: number,
    payload: AnyJson,
    txMetadata: AnyJson
  ) => {
    try {
      setIsExecuting(true)
      const { app, productName } = await Ledger.initialise(txMetadataChainId)
      setFeedback(t('approveTransactionLedger'))

      const result = await Ledger.signPayload(app, index, payload, txMetadata)

      setIsExecuting(false)
      setFeedback(t('signedTransactionSuccessfully'))

      setTransportResponse({
        statusCode: 'SignedPayload',
        device: { productName },
        body: {
          uid,
          sig: result.signature,
        },
      })
    } catch (err) {
      handleErrors(err)
    }
  }

  // Handles errors that occur during device calls
  const handleErrors = (err: unknown) => {
    // Update feedback and status code state based on error received
    switch (getLedgerErrorType(String(err))) {
      // Occurs when the device does not respond to a request within the timeout period
      case 'timeout':
        setStatusFeedback({
          message: t('ledgerRequestTimeout'),
          helpKey: 'Ledger Request Timeout',
          code: 'DeviceTimeout',
        })
        break
      // Occurs when a method in a all is not supported by the device
      case 'methodNotSupported':
        setStatusFeedback({
          message: t('methodNotSupported'),
          code: 'MethodNotSupported',
        })
        break
      // Occurs when one or more of nested calls being signed does not support nesting
      case 'nestingNotSupported':
        setStatusFeedback({
          message: t('missingNesting'),
          code: 'NestingNotSupported',
        })
        break
      // Cccurs when the device is not connected
      case 'deviceNotConnected':
        setStatusFeedback({
          message: t('connectLedgerToContinue'),
          code: 'DeviceNotConnected',
        })
        break
      // Occurs when tx was approved outside of active channel
      case 'outsideActiveChannel':
        setStatusFeedback({
          message: t('queuedTransactionRejected'),
          helpKey: 'Wrong Transaction',
          code: 'WrongTransaction',
        })
        break
      // Occurs when the device is already in use
      case 'deviceBusy':
        setStatusFeedback({
          message: t('ledgerDeviceBusy'),
          code: 'DeviceBusy',
        })
        break
      // Occurs when the device is locked
      case 'deviceLocked':
        setStatusFeedback({
          message: t('unlockLedgerToContinue'),
          code: 'DeviceLocked',
        })
        break
      // Occurs when the app (e.g. Polkadot) is not open
      case 'appNotOpen':
        setStatusFeedback({
          message: t('openAppOnLedger'),
          helpKey: 'Open App On Ledger',
          code: 'TransactionRejected',
        })
        break
      // Occurs when submitted extrinsic(s) are not supported
      case 'txVersionNotSupported':
        setStatusFeedback({
          message: t('txVersionNotSupported'),
          code: 'TransactionVersionNotSupported',
        })
        break
      // Occurs when a user rejects a transaction
      case 'transactionRejected':
        setStatusFeedback({
          message: t('transactionRejectedPending'),
          helpKey: 'Ledger Rejected Transaction',
          code: 'AppNotOpen',
        })
        break
      // Handle all other errors
      default:
        setFeedback(t('openAppOnLedger'), 'Open App On Ledger')
        setStatusCode('failure', 'AppNotOpen')
    }

    // Reset refs
    runtimesInconsistent.current = false
    // Reset state
    setIsExecuting(false)
  }

  // Helper to reset ledger state when a task is completed or cancelled
  const handleResetLedgerTask = () => {
    setIsExecuting(false)
    resetStatusCode()
    resetFeedback()
    setIntegrityChecked(false)
    runtimesInconsistent.current = false
  }

  // Helper to reset ledger state when the a overlay connecting to the Ledger device unmounts
  const handleUnmount = () => {
    Ledger.unmount()
    handleResetLedgerTask()
  }

  return (
    <LedgerHardwareContext.Provider
      value={{
        integrityChecked,
        setIntegrityChecked,
        checkRuntimeVersion,
        transportResponse,
        getIsExecuting,
        setIsExecuting,
        getStatusCode,
        setStatusCode,
        resetStatusCode,
        getFeedback,
        setFeedback,
        resetFeedback,
        handleGetAddress,
        handleSignTx,
        handleResetLedgerTask,
        handleErrors,
        handleUnmount,
        runtimesInconsistent: runtimesInconsistent.current,
      }}
    >
      {children}
    </LedgerHardwareContext.Provider>
  )
}
