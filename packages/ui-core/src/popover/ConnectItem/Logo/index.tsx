// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { FunctionComponent, SVGProps } from 'react'
import classes from './index.module.scss'

export const Logo = ({
  Svg,
}: {
  Svg: FunctionComponent<SVGProps<SVGSVGElement>>
}) => <span className={classes.logo}>{<Svg />}</span>
