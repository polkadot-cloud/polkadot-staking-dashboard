// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { Switch as RadixSwitch } from 'radix-ui'
import type { SwitchProps } from '../types'
import classes from './index.module.scss'

export const Switch = ({ checked }: SwitchProps) => (
  <RadixSwitch.Root className={classes.Root} checked={checked}>
    <RadixSwitch.Thumb className={classes.Thumb} />
  </RadixSwitch.Root>
)
