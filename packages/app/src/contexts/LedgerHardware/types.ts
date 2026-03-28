// Copyright 2026 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { MaybeString } from '@w3ux/types'
import type {
	AnyJson,
	FeedbackMessage,
	LedgerDeviceAddress,
	LedgerDeviceModel,
	LedgerResponse,
	LedgerStatusCode,
} from 'types'

export interface LedgerHardwareContextInterface {
	getDeviceModel: () => LedgerDeviceModel
	integrityChecked: boolean
	setIntegrityChecked: (checked: boolean) => void
	checkRuntimeVersion: () => Promise<void>
	transportResponse: AnyJson
	setStatusCode: (val: { ack: string; statusCode: LedgerStatusCode }) => void
	setIsExecuting: (v: boolean) => void
	statusCode: LedgerResponse | null
	resetStatusCode: () => void
	isExecuting: boolean
	getFeedback: () => FeedbackMessage
	setFeedback: (s: MaybeString, helpKey?: MaybeString) => void
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
