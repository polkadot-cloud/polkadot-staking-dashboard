// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { DisplayFor } from '@w3ux/types'
import type { ReactElement } from 'react'

export interface SignerProps {
  label: string
  name: string
  notEnoughFunds: boolean
  dangerMessage: string
}

export interface TxProps extends SignerProps {
  margin?: boolean
  SignerComponent: ReactElement
  displayFor?: DisplayFor
  transparent?: boolean
}
