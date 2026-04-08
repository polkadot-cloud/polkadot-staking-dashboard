// Copyright 2026 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

// Defaults
export { defaultDeviceModel, defaultFeedback, errorsByType } from './defaults'
// Device
export { Ledger } from './device/ledger'
// Hooks
export { useLedgerAccounts } from './hooks/useLedgerAccounts'
export type { UseLedgerAccountsReturn } from './hooks/useLedgerAccounts/types'
export { useLedgerTxPrompt } from './hooks/useLedgerTxPrompt'
export type { UseLedgerTxPromptReturn } from './hooks/useLedgerTxPrompt/types'
export { useLedgerTxSubmit } from './hooks/useLedgerTxSubmit'
export type {
	UseLedgerTxSubmitProps,
	UseLedgerTxSubmitReturn,
} from './hooks/useLedgerTxSubmit/types'
// Context & Provider
export { LedgerContext, LedgerProvider, useLedger } from './LedgerContext'
// Types
export type {
	ActiveAccount,
	AnyTransport,
	FeedbackMessage,
	HandleErrorFeedback,
	LedgerContextInterface,
	LedgerDeviceAddress,
	LedgerDeviceFamily,
	LedgerDeviceModel,
	LedgerResponse,
	LedgerStatusCode,
	LedgerTask,
	PairingStatus,
} from './types'
// Utilities
export {
	getLedgerDeviceFamily,
	getLedgerDeviceModel,
	getLedgerDeviceName,
	getLedgerErrorType,
	isTouchscreenDevice,
} from './utils'
