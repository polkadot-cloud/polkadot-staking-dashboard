// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { IconProp } from '@fortawesome/fontawesome-svg-core'
import type { AnyJson, MaybeAddress } from 'types'

export interface StatProps {
  label: string
  stat: AnyJson
  type?: string
  buttons?: AnyJson[]
  dimmed?: boolean
  helpKey: string
  icon?: IconProp
  buttonType?: string
}

export interface StatAddress {
  address: MaybeAddress
  display: string
}
