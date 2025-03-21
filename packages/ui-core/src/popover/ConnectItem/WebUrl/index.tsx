// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { ComponentBase } from '@w3ux/types'
import classes from './index.module.scss'

export const WebUrl = ({
  url,
  text,
  style,
}: ComponentBase & {
  url: string
  text: string
}) => (
  <h4 className={classes.webUrl} style={style}>
    <button
      type="button"
      onClick={(ev) => {
        ev.stopPropagation()
        window.open(url, '_blank')
      }}
    >
      {text}
    </button>
  </h4>
)
