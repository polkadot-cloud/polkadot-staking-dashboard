// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

export interface StakingContextInterface {
  isBonding: boolean
  isNominating: boolean
  isNominator: boolean
}

export interface ActiveAccountOwnStake {
  address: string
  value: string
}

export interface ActiveAccountStaker {
  address: string
  value: string
}
