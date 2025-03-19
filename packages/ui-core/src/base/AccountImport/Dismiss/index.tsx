// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { ComponentBase } from '@w3ux/types'
import classes from './index.module.scss'

export const Dismiss = ({
  style,
  onClick,
}: ComponentBase & {
  onClick: () => void
}) => (
  <button
    type="button"
    onClick={() => onClick()}
    className={classes.dismiss}
    style={style}
  />
)
