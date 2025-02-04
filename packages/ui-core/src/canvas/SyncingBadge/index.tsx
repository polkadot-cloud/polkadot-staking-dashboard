// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { ComponentBase } from '@w3ux/types'
import { Stat } from '../Stat'
import classes from './index.module.scss'

export const SyncingBadge = ({
  percentPassed,
  title,
  style,
}: ComponentBase & {
  percentPassed: string
  title: string
  continuous?: boolean
}) => (
  <Stat>
    {title}
    <div
      className={classes.loader}
      style={{ ...style, marginRight: '1.25rem' }}
    />
    <span className="counter">{percentPassed}%</span>
  </Stat>
)
