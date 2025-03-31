// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { BulletType } from 'common-types'
import type { FunctionComponent, SVGProps } from 'react'
import type { AnyJson } from 'types'

export interface MinimisedProps {
  $minimised?: boolean
}

export interface HeadingProps {
  title: string
  minimised: boolean
}

export interface PrimaryProps {
  name: string
  active: boolean
  to: string
  lottie: AnyJson
  bullet?: BulletType
  minimised: boolean
}

export interface SecondaryProps {
  name: string
  classes?: string[]
  onClick: () => void
  active?: boolean
  to?: string
  icon: IconProps
  bullet?: BulletType
  minimised: boolean
}

export interface IconProps {
  Svg: FunctionComponent<SVGProps<SVGSVGElement>>
  size?: string
}
