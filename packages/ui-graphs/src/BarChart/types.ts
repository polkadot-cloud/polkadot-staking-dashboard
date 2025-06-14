// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { ReactNode } from 'react'

export type DataClass = 'd1' | 'd2' | 'd3' | 'd4'

export interface LegendItemProps {
  dataClass?: DataClass
  label: string
  helpKey?: string
  button?: ReactNode
  onHelpClick?: (key: string) => void
}

export interface BarSegmentProps {
  dataClass: DataClass
  label?: string
  widthPercent: number
  flexGrow: number
  forceShow?: boolean
}

export interface BarChartWrapperProps {
  children: ReactNode
  lessPadding?: boolean
  style?: React.CSSProperties
}

export interface LegendProps {
  children: ReactNode
}

export interface BarProps {
  children: ReactNode
}

export interface BondedChartProps {
  active: bigint
  free: bigint
  unlocking: bigint
  unlocked: bigint
  inactive: boolean
  lessPadding?: boolean
  style?: React.CSSProperties
  labels: {
    bonded: string
    unlocking: string
    free: string
    available: string
  }
  unit: string
  units: number
  onHelpClick?: (key: string) => void
}