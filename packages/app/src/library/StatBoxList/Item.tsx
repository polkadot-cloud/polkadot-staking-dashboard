// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { AnyJson } from '@w3ux/types'
import type { ReactNode } from 'react'
import { Number } from './Number'
import { Pie } from './Pie'
import { Text } from './Text'
import { StatBoxWrapper } from './Wrapper'

export const StatBox = ({ children }: { children: ReactNode }) => (
  <StatBoxWrapper>{children}</StatBoxWrapper>
)

export const StatBoxListItem = ({
  format,
  params,
}: {
  format: string
  params: AnyJson
}) => {
  switch (format) {
    case 'chart-pie':
      return <Pie {...params} />

    case 'number':
      return <Number {...params} />

    case 'text':
      return <Text {...params} />

    default:
      return null
  }
}
