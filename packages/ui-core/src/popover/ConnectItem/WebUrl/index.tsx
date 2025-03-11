// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: AGPL-3.0

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
