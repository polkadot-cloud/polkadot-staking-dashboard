// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { Loader } from '../Loader'
import classes from './index.module.scss'

export const Preload = ({
  percentPassed,
  title,
  continuous = false,
}: {
  percentPassed: string
  title: string
  continuous?: boolean
}) => (
  <div className={classes.preload}>
    <h2>{title}</h2>
    {continuous ? (
      <Loader />
    ) : (
      <div className={classes.loader}>
        <div>
          <div
            className={classes.progress}
            style={{ width: `${percentPassed}%` }}
          ></div>
        </div>
      </div>
    )}
  </div>
)
