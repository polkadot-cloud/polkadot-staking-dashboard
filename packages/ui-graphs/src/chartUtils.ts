// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { FontSpec } from 'chart.js'
import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from 'chart.js'

// Register all common Chart.js components once
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
)

// Common font specification for chart titles
export const TITLE_FONT_SPEC: Partial<FontSpec> = {
  family: "'Inter', 'sans-serif'",
  weight: 'lighter',
  size: 11,
}

// Create standardized title style
export const createTitleStyle = (getThemeValue: (key: string) => string) => ({
  color: getThemeValue('--text-color-secondary'),
  display: true,
  padding: 6,
  font: TITLE_FONT_SPEC,
})

// Create standardized tooltip configuration
export const createTooltipConfig = (
  getThemeValue: (key: string) => string
) => ({
  displayColors: false,
  backgroundColor: getThemeValue('--background-invert'),
  titleColor: getThemeValue('--text-color-invert'),
  bodyColor: getThemeValue('--text-color-invert'),
  bodyFont: {
    weight: 600,
  },
  intersect: false,
  interaction: {
    mode: 'nearest' as const,
  },
})

// Base chart options
export const createBaseChartOptions = () => ({
  responsive: true,
  maintainAspectRatio: false,
})
