// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { IconDefinition } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import classes from './index.module.scss'

export const Icon = ({ faIcon }: { faIcon: IconDefinition }) => (
  <div className={classes.icon}>
    <FontAwesomeIcon icon={faIcon} />
  </div>
)
