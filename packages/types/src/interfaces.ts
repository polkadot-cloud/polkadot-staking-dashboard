// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { ExtraSignedExtension, SubmittableExtrinsic } from 'dedot'
import type {
  PalletNominationPoolsBondedPoolInner,
  PalletNominationPoolsPoolMember,
  PalletNominationPoolsPoolState,
  PalletStakingNominations,
  PalletStakingRewardDestination,
  PalletStakingValidatorPrefs,
  SpStakingExposurePage,
  SpStakingPagedExposureMetadata,
} from 'dedot/chaintypes'
import type { AccountId32, BytesLike } from 'dedot/codecs'
import type { HexString } from 'dedot/utils'
import type { IdentityOf, SuperOf } from './identity'
import type { ClaimPermission, PoolRoles } from './pools'

export interface ServiceInterface {
  query: {
    erasValidatorRewardMulti: (
      eras: number[]
    ) => Promise<(bigint | undefined)[]>
    bondedPool: (
      poolId: number
    ) => Promise<PalletNominationPoolsBondedPoolInner | undefined>
    bondedPoolEntries: () => Promise<
      [number, PalletNominationPoolsBondedPoolInner][]
    >
    erasStakersOverviewEntries: (
      era: number
    ) => Promise<[[number, AccountId32], SpStakingPagedExposureMetadata][]>
    erasStakersPagedEntries: (
      era: number,
      validator: string
    ) => Promise<[[number, AccountId32, number], SpStakingExposurePage][]>
    identityOfMulti: (addresses: string[]) => Promise<IdentityOf[]>
    nominatorsMulti: (
      addresses: string[]
    ) => Promise<(PalletStakingNominations | undefined)[]>
    paraSessionAccounts: (session: number) => Promise<AccountId32[] | undefined>
    poolMembersMulti: (
      addresses: string[]
    ) => Promise<(PalletNominationPoolsPoolMember | undefined)[]>
    poolMetadataMulti: (ids: number[]) => Promise<HexString[]>
    proxies: (address: string) => Promise<AccountId32[]>
    sessionValidators: () => Promise<AccountId32[]>
    superOfMulti: (addresses: string[]) => Promise<SuperOf[]>
    validatorEntries: () => Promise<
      [AccountId32, PalletStakingValidatorPrefs][]
    >
    validatorsMulti: (
      addresses: string[]
    ) => Promise<PalletStakingValidatorPrefs[]>
  }
  runtimeApi: {
    balanceToPoints: (poolId: number, amount: bigint) => Promise<bigint>
    pendingRewards: (address: string) => Promise<bigint>
    pointsToBalance: (poolId: number, points: bigint) => Promise<bigint>
  }
  tx: {
    batch: (calls: SubmittableExtrinsic[]) => SubmittableExtrinsic | undefined
    createPool: (
      from: string,
      poolId: number,
      bond: bigint,
      metadata: string,
      nominees: string[],
      roles: PoolRoles | null
    ) => SubmittableExtrinsic[] | undefined
    fastUnstakeDeregister: () => SubmittableExtrinsic | undefined
    fastUnstakeRegister: () => SubmittableExtrinsic | undefined
    joinPool: (
      poolId: number,
      bond: bigint,
      claimPermission: ClaimPermission
    ) => SubmittableExtrinsic | SubmittableExtrinsic[] | undefined
    newNominator: (
      bond: bigint,
      payee: PalletStakingRewardDestination,
      nominees: string[]
    ) => SubmittableExtrinsic[] | undefined
    payoutStakersByPage: (
      validator: string,
      era: number,
      page: number
    ) => SubmittableExtrinsic | undefined
    poolBondExtra: (
      type: 'FreeBalance' | 'Rewards',
      bond?: bigint
    ) => SubmittableExtrinsic | undefined
    poolChill: (poolId: number) => SubmittableExtrinsic | undefined
    poolClaimCommission: (poolId: number) => SubmittableExtrinsic | undefined
    poolClaimPayout: () => SubmittableExtrinsic | undefined
    poolNominate: (
      poolId: number,
      nominees: string[]
    ) => SubmittableExtrinsic | undefined
    poolSetClaimPermission: (
      claimPermission: ClaimPermission
    ) => SubmittableExtrinsic | undefined
    poolSetCommission: (
      poolId: number,
      commission?: [number, string]
    ) => SubmittableExtrinsic | undefined
    poolSetCommissionChangeRate: (
      poolId: number,
      maxIncrease: number,
      minDelay: number
    ) => SubmittableExtrinsic | undefined
    poolSetCommissionMax: (
      poolId: number,
      max: number
    ) => SubmittableExtrinsic | undefined
    poolSetMetadata: (
      poolId: number,
      metadata: BytesLike
    ) => SubmittableExtrinsic | undefined
    poolSetState: (
      poolId: number,
      state: PalletNominationPoolsPoolState
    ) => SubmittableExtrinsic | undefined
    poolUnbond: (
      who: string,
      points: bigint
    ) => SubmittableExtrinsic | undefined
    poolUpdateRoles: (
      poolId: number,
      roles: PoolRoles
    ) => SubmittableExtrinsic | undefined
    poolWithdraw: (
      who: string,
      numSlashingSpans: number
    ) => SubmittableExtrinsic | undefined
    proxy: (
      real: string,
      call: SubmittableExtrinsic
    ) => SubmittableExtrinsic | undefined
    stakingBondExtra: (bond: bigint) => SubmittableExtrinsic | undefined
    stakingChill: () => SubmittableExtrinsic | undefined
    stakingNominate: (nominees: string[]) => SubmittableExtrinsic | undefined
    stakingRebond: (bond: bigint) => SubmittableExtrinsic | undefined
    stakingSetPayee: (
      payee: PalletStakingRewardDestination
    ) => SubmittableExtrinsic | undefined
    stakingUnbond: (bond: bigint) => SubmittableExtrinsic | undefined
    stakingWithdraw: (
      numSlashingSpans: number
    ) => SubmittableExtrinsic | undefined
    transferKeepAlive: (
      to: string,
      value: bigint
    ) => SubmittableExtrinsic | undefined
  }
  signer: {
    extraSignedExtension: (
      signerAddress: string
    ) => ExtraSignedExtension | undefined
  }
  unsafe: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    metadata: () => any
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    $Signature: () => any
  }
}
