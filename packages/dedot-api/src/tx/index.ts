// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { batch } from './batch'
import { createPool } from './createPool'
import { fastUnstakeDeregister } from './fastUnstakeDeregister'
import { fastUnstakeRegister } from './fastUnstakeRegister'
import { joinPool } from './joinPool'
import { newNominator } from './newNominator'
import { payoutStakersByPage } from './payoutStakersByPage'
import { poolBondExtra } from './poolBondExtra'
import { poolChill } from './poolChill'
import { poolClaimCommission } from './poolClaimCommission'
import { poolClaimPayout } from './poolClaimPayout'
import { poolNominate } from './poolNominate'
import { poolSetClaimPermission } from './poolSetClaimPermission'
import { poolSetCommission } from './poolSetCommission'
import { poolSetCommissionChangeRate } from './poolSetCommissionChangeRate'
import { poolSetCommissionMax } from './poolSetCommissionMax'
import { poolSetMetadata } from './poolSetMetadata'
import { poolSetState } from './poolSetState'
import { poolUnbond } from './poolUnbond'
import { poolUpdateRoles } from './poolUpdateRoles'
import { poolWithdraw } from './poolWithdraw'
import { proxy } from './proxy'
import { stakingBondExtra } from './stakingBondExtra'
import { stakingChill } from './stakingChill'
import { stakingNominate } from './stakingNominate'
import { stakingRebond } from './stakingRebond'
import { stakingSetPayee } from './stakingSetPayee'
import { stakingUnbond } from './stakingUnbond'
import { stakingWithdraw } from './stakingWithdraw'
import { transferKeepAlive } from './transferKeepAlive'

export const tx = {
  batch,
  createPool,
  fastUnstakeDeregister,
  fastUnstakeRegister,
  joinPool,
  newNominator,
  payoutStakersByPage,
  poolBondExtra,
  poolChill,
  poolClaimCommission,
  poolClaimPayout,
  poolNominate,
  poolSetClaimPermission,
  poolSetCommission,
  poolSetCommissionChangeRate,
  poolSetCommissionMax,
  poolSetMetadata,
  poolSetState,
  poolUnbond,
  poolUpdateRoles,
  poolWithdraw,
  proxy,
  stakingBondExtra,
  stakingChill,
  stakingNominate,
  stakingRebond,
  stakingSetPayee,
  stakingUnbond,
  stakingWithdraw,
  transferKeepAlive,
}
