// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: AGPL-3.0

import type { FunctionComponent, SVGProps } from 'react'
import classes from './index.module.scss'

export const Logo = ({
  Svg,
}: {
  Svg: FunctionComponent<SVGProps<SVGSVGElement>>
}) => <span className={classes.logo}>{<Svg />}</span>
