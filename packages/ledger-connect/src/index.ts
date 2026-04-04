// Copyright 2026 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

// Defaults
export { defaultDeviceModel, defaultFeedback, errorsByType } from './defaults'
export { useLedgerTxPrompt } from './hooks/useLedgerTxPrompt'
export type { UseLedgerTxPromptReturn } from './hooks/useLedgerTxPrompt/types'
// Hooks
export { useLedgerTxSubmit } from './hooks/useLedgerTxSubmit'
export type {
	UseLedgerTxSubmitProps,
	UseLedgerTxSubmitReturn,
} from './hooks/useLedgerTxSubmit/types'
// Context
export {
	LedgerHardwareContext,
	LedgerHardwareProvider,
	useLedgerHardware,
} from './LedgerHardwareContext'
// Static Ledger class
export { Ledger } from './static/ledger'
// Types
export type {
	ActiveAccount,
	AnyTransport,
	FeedbackMessage,
	HandleErrorFeedback,
	LedgerDeviceAddress,
	LedgerDeviceFamily,
	LedgerDeviceModel,
	LedgerHardwareContextInterface,
	LedgerResponse,
	LedgerStatusCode,
	LedgerTask,
	LedgerTranslateFn,
	PairingStatus,
} from './types'
// Utilities
export {
	getLedgerDeviceFamily,
	getLedgerDeviceModel,
	getLedgerDeviceName,
	getLedgerErrorType,
	isTouchscreenDevice,
} from './util'
