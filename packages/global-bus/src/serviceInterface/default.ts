// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { ServiceInterface } from 'types'

export const defaultServiceInterface: ServiceInterface = {
  query: {
    erasValidatorRewardMulti: async () => [],
    bondedPool: async () => undefined,
    bondedPoolEntries: async () => [],
    erasStakersOverviewEntries: async () => [],
    erasStakersPagedEntries: async () => [],
    identityOfMulti: async () => [],
    nominatorsMulti: async () => [],
    poolMembersMulti: async () => [],
    poolMetadataMulti: async () => [],
    proxies: async () => [],
    sessionValidators: async () => [],
    superOfMulti: async () => [],
    validatorEntries: async () => [],
    validatorsMulti: async () => [],
  },
  runtimeApi: {
    balanceToPoints: async () => BigInt(0),
    pendingRewards: async () => BigInt(0),
    pointsToBalance: async () => BigInt(0),
  },
  tx: {
    batch: () => undefined,
    createPool: () => undefined,
    fastUnstakeDeregister: () => undefined,
    fastUnstakeRegister: () => undefined,
    joinPool: () => undefined,
    newNominator: () => undefined,
    payoutStakersByPage: () => undefined,
    poolBondExtra: () => undefined,
    poolChill: () => undefined,
    poolClaimCommission: () => undefined,
    poolClaimPayout: () => undefined,
    poolNominate: () => undefined,
    poolSetClaimPermission: () => undefined,
    poolSetCommission: () => undefined,
    poolSetCommissionChangeRate: () => undefined,
    poolSetCommissionMax: () => undefined,
    poolSetMetadata: () => undefined,
    poolSetState: () => undefined,
    poolUnbond: () => undefined,
    poolUpdateRoles: () => undefined,
    poolWithdraw: () => undefined,
    proxy: () => undefined,
    setController: () => undefined,
    stakingBondExtra: () => undefined,
    stakingChill: () => undefined,
    stakingNominate: () => undefined,
    stakingRebond: () => undefined,
    stakingSetPayee: () => undefined,
    stakingUnbond: () => undefined,
    stakingWithdraw: () => undefined,
    transferKeepAlive: () => undefined,
  },
  signer: {
    extraSignedExtension: () => undefined,
    metadata: async () => undefined,
  },
  spec: {
    ss58: () => 0,
  },
  codec: {
    $Signature: () => undefined,
  },
}
