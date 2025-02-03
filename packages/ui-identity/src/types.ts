// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type React from 'react'

export interface IdentityProps {
  title: string
  address: string
  identity?: string
  Action: React.ReactNode
  iconSize?: string | number
}
