// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { faCheck } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import type { CheckboxProps } from '../types'
import classes from './index.module.scss'

export const Checkbox = ({ style, onClick, checked }: CheckboxProps) => (
  <button
    type="button"
    className={classes.checkbox}
    style={style}
    onClick={() => onClick()}
  >
    {checked && <FontAwesomeIcon icon={faCheck} transform="shrink-2" />}
  </button>
)
