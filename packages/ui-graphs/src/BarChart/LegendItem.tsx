// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import classes from './index.module.scss'
import type { LegendItemProps } from './types'

export const LegendItem = ({
  dataClass,
  label,
  helpKey,
  button,
  onHelpClick,
}: LegendItemProps) => (
  <h4>
    {dataClass ? <span className={classes[dataClass]} /> : null} {label}
    {helpKey && onHelpClick ? (
      <button
        type="button"
        onClick={() => onHelpClick(helpKey)}
        style={{ marginLeft: '0.5rem' }}
      >
        ?
      </button>
    ) : null}
    {button && button}
  </h4>
)
