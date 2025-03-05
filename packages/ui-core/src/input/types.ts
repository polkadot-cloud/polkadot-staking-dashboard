// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { ChangeEvent } from 'react'

export interface TokenInputProps {
  onChange: (e: ChangeEvent<HTMLInputElement>) => void
  placeholder: string
  value: string
  marginY?: boolean
  id: string
  label: string
}

export interface SwitchProps {
  checked: boolean
}
