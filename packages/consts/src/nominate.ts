// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

// Recommend users to nominate with a buffer above the minimum bond earn rewards. Prevents
// situations where bonded amount is less than minimum to earn rewards in volatile network
// conditions.
export const NominateBuffer: bigint = 150n // 150%
