// Copyright 2026 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

// Hooks
export { useVaultTxSubmit } from './hooks/useVaultTxSubmit'
export type {
	UseVaultTxSubmitProps,
	UseVaultTxSubmitReturn,
} from './hooks/useVaultTxSubmit/types'

// QR Code components
export { QrDisplay } from './QRCode/Display'
export { QrDisplayPayload } from './QRCode/DisplayPayload'
export { QrScan } from './QRCode/Scan'
export { QrScanSignature } from './QRCode/ScanSignature'

// QR Code types
export type {
	DisplayPayloadProps,
	DisplayProps,
	ScanProps,
	ScanSignatureProps,
	ScanType,
} from './QRCode/types'

// Signers
export {
	type DeriveVaultButtonStateInput,
	type DeriveVaultButtonStateOutput,
	deriveVaultButtonState,
} from './signers'

// Vault Signer
export { VaultSigner } from './VaultSigner'
export type {
	VaultPromptHandlers,
	VaultSignatureResult,
	VaultSignStatus,
} from './VaultSigner/types'
