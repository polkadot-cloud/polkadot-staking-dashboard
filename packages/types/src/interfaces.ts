// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { ExtraSignedExtension, SubmittableExtrinsic } from 'dedot'
import type {
  PalletNominationPoolsPoolMember,
  PalletNominationPoolsPoolState,
  PalletStakingRewardDestination,
  PalletStakingValidatorPrefs,
} from 'dedot/chaintypes'
import type { BytesLike } from 'dedot/codecs'
import type { Shape } from 'dedot/shape'
import type { PayloadOptions } from 'dedot/types'
import type { HexString } from 'dedot/utils'
import type { IdentityOf, SuperOf } from './identity'
import type { NominatorsMultiQuery } from './nominate'
import type { BondedPoolQuery, ClaimPermission, PoolRoles } from './pools'
import type {
  ErasStakersOverviewEntries,
  ErasStakersPagedEntries,
} from './staking'

export interface ServiceInterface {
  query: {
    erasValidatorRewardMulti: (
      eras: number[]
    ) => Promise<(bigint | undefined)[]>
    bondedPool: (poolId: number) => Promise<BondedPoolQuery | undefined>
    bondedPoolEntries: () => Promise<[number, BondedPoolQuery][]>
    erasStakersOverviewEntries: (
      era: number
    ) => Promise<ErasStakersOverviewEntries>
    erasStakersPagedEntries: (
      era: number,
      validator: string
    ) => Promise<ErasStakersPagedEntries>
    identityOfMulti: (addresses: string[]) => Promise<IdentityOf[]>
    nominatorsMulti: (addresses: string[]) => Promise<NominatorsMultiQuery>
    poolMembersMulti: (
      addresses: string[]
    ) => Promise<(PalletNominationPoolsPoolMember | undefined)[]>
    poolMetadataMulti: (ids: number[]) => Promise<HexString[]>
    proxies: (address: string) => Promise<string[]>
    sessionValidators: () => Promise<string[]>
    superOfMulti: (addresses: string[]) => Promise<SuperOf[]>
    validatorEntries: () => Promise<[string, PalletStakingValidatorPrefs][]>
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
    ) => SubmittableExtrinsic[] | undefined
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
      specName: string,
      signerAddress: string,
      payloadOptions?: PayloadOptions
    ) => ExtraSignedExtension | undefined
    metadata: (specName: string) => Promise<HexString | undefined>
  }
  spec: {
    ss58: (specName: string) => number
  }
  codec: {
    $Signature: (specName: string) => Shape<unknown, unknown> | undefined
  }
}
