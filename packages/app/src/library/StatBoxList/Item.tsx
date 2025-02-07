// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { AnyJson } from '@w3ux/types'
import { Number } from './Number'
import { Pie } from './Pie'
import { Text } from './Text'

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
