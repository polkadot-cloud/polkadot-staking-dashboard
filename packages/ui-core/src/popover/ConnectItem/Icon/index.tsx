// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: AGPL-3.0

import type { IconDefinition } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import classes from './index.module.scss'

export const Icon = ({ faIcon }: { faIcon: IconDefinition }) => (
  <div className={classes.icon}>
    <FontAwesomeIcon icon={faIcon} />
  </div>
)
