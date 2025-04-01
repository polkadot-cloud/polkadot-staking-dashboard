// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { ReactNode } from 'react'
import classes from './index.module.scss'

export const Header = ({
  Logo,
  title,
  websiteText,
  websiteUrl,
  children,
}: {
  Logo: ReactNode
  title: string
  websiteText: string
  websiteUrl: string
  children: ReactNode
}) => (
  <div className={classes.header}>
    <div>{Logo}</div>
    <div>
      <h3>{title}</h3>
      <h4>
        <a href={websiteUrl} target="blank" rel="noreferrer">
          {websiteText}
        </a>
      </h4>
    </div>
    <div>{children}</div>
  </div>
)
