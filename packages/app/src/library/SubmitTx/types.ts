// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { IconProp } from '@fortawesome/fontawesome-svg-core'
import type { DisplayFor } from '@w3ux/types'
import type { VaultSignatureResult } from 'library/Signers/VaultSigner/types'
import type { ReactNode } from 'react'
import type { MaybeAddress } from 'types'

export type SubmitTxProps = SubmitProps & {
  buttons?: ReactNode[]
  fromController?: boolean
  proxySupported: boolean
  submitAddress?: MaybeAddress
  noMargin?: boolean
  onResize?: () => void
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
  processing: boolean
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
