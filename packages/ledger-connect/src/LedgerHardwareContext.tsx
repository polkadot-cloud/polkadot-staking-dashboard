// Copyright 2026 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { createSafeContext } from '@w3ux/hooks'
import type { MaybeString } from '@w3ux/types'
import { setStateWithRef } from '@w3ux/utils'
import type { ReactNode } from 'react'
import { useRef, useState } from 'react'
import type {
	AnyJson,
	FeedbackMessage,
	HandleErrorFeedback,
	LedgerDeviceAddress,
	LedgerDeviceModel,
	LedgerResponse,
} from 'types'
import { defaultFeedback } from './defaults'
import { Ledger } from './static/ledger'
import type { LedgerHardwareContextInterface } from './types'
import { getLedgerDeviceModel, getLedgerErrorType } from './util'

export const [LedgerHardwareContext, useLedgerHardware] =
	createSafeContext<LedgerHardwareContextInterface>()

export const LedgerHardwareProvider = ({
	children,
}: {
	children: ReactNode
}) => {
	// Resolve the current Ledger model directly from the active transport instead of persisting a
	// global device selection in React state.
	const getDeviceModel = (): LedgerDeviceModel =>
		getLedgerDeviceModel(Ledger.transport?.device?.productName || '')

	// Store whether a Ledger device task is in progress
	const [isExecuting, setIsExecutingState] = useState<boolean>(false)
	const isExecutingRef = useRef(isExecuting)

	const setIsExecuting = (val: boolean) =>
		setStateWithRef(val, setIsExecutingState, isExecutingRef)

	// Store the latest status code received from a Ledger device
	const [statusCode, setStatusCode] = useState<LedgerResponse | null>(null)

	const resetStatusCode = () => setStatusCode(null)

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
		setStatusCode({ ack: 'failure', statusCode: code })
		setFeedback(message, helpKey)
	}

	// Stores whether the Ledger device version has been checked. Used when signing transactions, not
	// when addresses are being imported
	const [integrityChecked, setIntegrityChecked] = useState<boolean>(false)

	// Store the latest successful device response
	const [transportResponse, setTransportResponse] = useState<AnyJson>(null)

	// Checks if the Ledger device is connected
	const checkRuntimeVersion = async () => {
		try {
			setIsExecuting(true)
			const { app } = await Ledger.initialise()
			// Device is connected, verify it's responding
			await Ledger.getVersion(app)

			setIsExecuting(false)
			resetFeedback()
			setIntegrityChecked(true)
		} catch (err) {
			handleErrors(err)
		}
	}

	// Gets an address from Ledger device
	const handleGetAddress = async (accountIndex: number, ss58Prefix: number) => {
		try {
			setIsExecuting(true)
			const { app, deviceModel: model } = await Ledger.initialise()
			const result = await Ledger.getAddress(app, accountIndex, ss58Prefix)

			setIsExecuting(false)
			setFeedback('successfullyFetchedAddress')
			setTransportResponse({
				ack: 'success',
				statusCode: 'ReceivedAddress',
				options: {
					accountIndex,
				},
				device: {
					deviceModel: model,
				},
				body: [result],
			})
		} catch (err) {
			handleErrors(err)
		}
	}

	// Gets an address from Ledger device without updating transport response
	const fetchLedgerAddress = async (
		accountIndex: number,
		ss58Prefix: number,
	): Promise<LedgerDeviceAddress | null> => {
		try {
			setIsExecuting(true)
			const { app, deviceModel: model } = await Ledger.initialise()
			const result = (await Ledger.getAddress(
				app,
				accountIndex,
				ss58Prefix,
			)) as LedgerDeviceAddress
			return {
				...result,
				deviceModel: model,
			}
		} catch (err) {
			handleErrors(err)
			return null
		} finally {
			setIsExecuting(false)
		}
	}

	// Handles errors that occur during device calls
	const handleErrors = (err: unknown) => {
		// Update feedback and status code state based on error received
		switch (getLedgerErrorType(String(err))) {
			// Occurs when the device does not respond to a request within the timeout period
			case 'timeout':
				setStatusFeedback({
					message: 'ledgerRequestTimeout',
					helpKey: 'Ledger Request Timeout',
					code: 'DeviceTimeout',
				})
				break
			// Occurs when a method in a call is not supported by the device
			case 'methodNotSupported':
				setStatusFeedback({
					message: 'methodNotSupported',
					code: 'MethodNotSupported',
				})
				break
			// Occurs when one or more of nested calls being signed does not support nesting
			case 'nestingNotSupported':
				setStatusFeedback({
					message: 'missingNesting',
					code: 'NestingNotSupported',
				})
				break
			// Occurs when the device is not connected
			case 'deviceNotConnected':
				setStatusFeedback({
					message: 'connectLedgerToContinue',
					code: 'DeviceNotConnected',
				})
				break
			// Occurs when tx was approved outside of active channel
			case 'outsideActiveChannel':
				setStatusFeedback({
					message: 'queuedTransactionRejected',
					helpKey: 'Wrong Transaction',
					code: 'WrongTransaction',
				})
				break
			// Occurs when the device is already in use
			case 'deviceBusy':
				setStatusFeedback({
					message: 'ledgerDeviceBusy',
					code: 'DeviceBusy',
				})
				break
			// Occurs when the device is locked
			case 'deviceLocked':
				setStatusFeedback({
					message: 'unlockLedgerToContinue',
					code: 'DeviceLocked',
				})
				break
			// Occurs when the app (e.g. Polkadot) is not open
			case 'appNotOpen':
				setStatusFeedback({
					message: 'openAppOnLedger',
					helpKey: 'Open App On Ledger',
					code: 'AppNotOpen',
				})
				break
			// Occurs when submitted extrinsic(s) are not supported
			case 'txVersionNotSupported':
				setStatusFeedback({
					message: 'txVersionNotSupported',
					code: 'TransactionVersionNotSupported',
				})
				break
			// Occurs when a user rejects a transaction
			case 'transactionRejected':
				setStatusFeedback({
					message: 'transactionRejectedPending',
					helpKey: 'Ledger Rejected Transaction',
					code: 'TransactionRejected',
				})
				break
			// Handle all other errors
			default:
				setFeedback('openAppOnLedger', 'Open App On Ledger')
				setStatusCode({ ack: 'failure', statusCode: 'AppNotOpen' })
		}

		// Reset state
		setIsExecuting(false)
	}

	// Helper to reset ledger state when a task is completed or cancelled. Device model is
	// intentionally preserved so subsequent modals can reference the detected device
	const handleResetLedgerTask = () => {
		setIsExecuting(false)
		resetStatusCode()
		resetFeedback()
		setIntegrityChecked(false)
	}

	// Helper to reset ledger state when the a overlay connecting to the Ledger device unmounts
	const handleUnmount = () => {
		Ledger.unmount()
		handleResetLedgerTask()
	}

	return (
		<LedgerHardwareContext.Provider
			value={{
				getDeviceModel,
				integrityChecked,
				setIntegrityChecked,
				checkRuntimeVersion,
				transportResponse,
				isExecuting,
				setIsExecuting,
				statusCode,
				setStatusCode,
				resetStatusCode,
				getFeedback,
				setFeedback,
				resetFeedback,
				handleGetAddress,
				fetchLedgerAddress,
				handleResetLedgerTask,
				handleErrors,
				handleUnmount,
			}}
		>
			{children}
		</LedgerHardwareContext.Provider>
	)
}
