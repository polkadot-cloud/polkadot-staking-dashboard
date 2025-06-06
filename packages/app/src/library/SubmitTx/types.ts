// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { IconProp } from '@fortawesome/fontawesome-svg-core'
import type { VaultSignatureResult } from 'library/Signers/VaultSigner/types'
import type { ReactNode } from 'react'
import type { DisplayFor, MaybeAddress } from 'types'

export type SubmitTxProps = SubmitProps & {
  buttons?: ReactNode[]
  requiresMigratedController?: boolean
  proxySupported: boolean
  submitAddress?: MaybeAddress
  noMargin?: boolean
  onResize?: () => void
  transparent?: boolean
  txInitiated: boolean
}

export interface SubmitProps {
  uid: number
  onSubmit: () => void
  valid: boolean
  submitText?: string
  submitAddress: MaybeAddress
  displayFor?: DisplayFor
}

export interface SignerPromptProps {
  submitAddress: MaybeAddress
  toSign: Uint8Array
  onComplete: (
    status: 'complete' | 'cancelled',
    signature: VaultSignatureResult
  ) => void
}

export interface LedgerSubmitProps {
  onSubmit: () => void
  submitted: boolean
  displayFor?: DisplayFor
  disabled: boolean
  submitText?: string
}

export interface ButtonSubmitLargeProps {
  disabled: boolean
  onSubmit: () => void
  submitText: string
  icon?: IconProp
  iconTransform?: string
  pulse: boolean
}
