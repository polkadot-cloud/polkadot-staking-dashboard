// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

// Re-export all functions from the modular structure to maintain backward compatibility

// Calculations
export { calculatePayoutAverages, percentageOf } from './calculations'

// Date utilities
export {
  fillGapDays,
  getPayoutsFromDate,
  getPayoutsInTimeRange,
  getPayoutsToDate,
  normalizePayouts as normalisePayouts, // Keep old spelling for backward compatibility
  postFillMissingDays,
  prefillMissingDays,
  filterAndSortRewards as removeNonZeroAmountAndSort, // Keep old name for backward compatibility
} from './dateUtils'

// Data processing - export both old signature and new config-based versions
export {
  calculateDailyPayouts,
  calculateDailyPayoutsWithConfig,
  combineRewards,
  getLatestReward,
  processPayouts,
  processPayoutsWithConfig,
} from './dataProcessing'

// Formatters - export both the main function and the config-based version
export {
  formatRewardsForGraphs,
  formatRewardsForGraphsWithConfig,
} from './formatters'
