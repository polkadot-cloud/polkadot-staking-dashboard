// Copyright 2026 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { MaybeString } from '@w3ux/types'

// biome-ignore lint/suspicious/noExplicitAny: <ledger device transport shape is dynamic and not worth typing>
export type AnyTransport = any

/**
 * Supported Ledger device models.
 */
export type LedgerDeviceModel =
	| 'nano_s'
	| 'nano_x'
	| 'nano_s_plus'
	| 'flex'
	| 'stax'
	| 'unknown'

/**
 * Device family grouping: nano (button-based) vs touchscreen.
 */
export type LedgerDeviceFamily = 'nano' | 'touchscreen' | 'unknown'

export interface FeedbackMessage {
	message: MaybeString
	helpKey?: MaybeString
	params?: Record<string, string>
}

export type LedgerStatusCode =
	| 'GettingAddress'
	| 'ReceivedAddress'
	| 'SigningPayload'
	| 'SignedPayload'
	| 'DeviceBusy'
	| 'DeviceTimeout'
	| 'MethodNotSupported'
	| 'NestingNotSupported'
	| 'WrongTransaction'
	| 'DeviceNotConnected'
	| 'DeviceLocked'
	| 'TransactionVersionNotSupported'
	| 'TransactionRejected'
	| 'AppNotOpenContinue'
	| 'AppNotOpen'

export interface LedgerResponse {
	ack: string
	statusCode: LedgerStatusCode
	body?: AnyTransport
	device?: {
		deviceModel?: LedgerDeviceModel
	}
	options?: AnyTransport
}

export type LedgerTask = 'get_address' | 'sign_tx'

export type PairingStatus = 'paired' | 'unpaired' | 'unknown'

export interface LedgerDeviceAddress {
	address: string
	pubKey: string
	deviceModel?: LedgerDeviceModel
}

export interface HandleErrorFeedback {
	message: MaybeString
	helpKey?: MaybeString
	code: LedgerStatusCode
	params?: Record<string, string>
}

export type ActiveAccount = {
	address: string
	source: string
} | null

export interface LedgerContextInterface {
	getDeviceModel: () => LedgerDeviceModel
	integrityChecked: boolean
	setIntegrityChecked: (checked: boolean) => void
	checkRuntimeVersion: () => Promise<void>
	transportResponse: AnyTransport
	setStatusCode: (val: { ack: string; statusCode: LedgerStatusCode }) => void
	setIsExecuting: (v: boolean) => void
	statusCode: LedgerResponse | null
	resetStatusCode: () => void
	isExecuting: boolean
	getFeedbackCode: () => FeedbackMessage
	setFeedbackCode: (
		s: MaybeString,
		helpKey?: MaybeString,
		params?: Record<string, string>,
	) => void
	resetFeedback: () => void
	handleUnmount: () => void
	handleErrors: (err: unknown) => void
	handleGetAddress: (accountIndex: number, ss58Prefix: number) => Promise<void>
	handleResetLedgerTask: () => void
	fetchLedgerAddress: (
		accountIndex: number,
		ss58Prefix: number,
	) => Promise<LedgerDeviceAddress | null>
}
