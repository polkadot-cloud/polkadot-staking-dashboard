// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

// Recommend users to nominate with 150% of the minimum bond to earn rewards. This adds a
// 50% buffer above the minimum and helps prevent situations where the bonded amount drops
// below the minimum required to earn rewards in volatile network conditions.
export const NominateBuffer: bigint = 150n // 150%
