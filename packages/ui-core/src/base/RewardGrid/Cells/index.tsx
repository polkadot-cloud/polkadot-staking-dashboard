// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { ComponentBase } from '@w3ux/types'
import type { ReactNode } from 'react'
import { Cell } from '../Cell'

export const Cells = ({
  items,
}: ComponentBase & {
  items: React.ReactNode[]
}): ReactNode => items.map((item, i) => <Cell key={`cell_${i}`}>{item}</Cell>)
