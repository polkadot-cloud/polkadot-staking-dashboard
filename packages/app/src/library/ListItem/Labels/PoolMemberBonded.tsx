// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import BigNumber from 'bignumber.js'
import { getNetworkData } from 'consts/util'
import { useNetwork } from 'contexts/Network'
import type { FetchedPoolMember } from 'contexts/Pools/PoolMembers/types'
import { ValidatorStatusWrapper } from 'library/ListItem/Wrappers'
import { useTranslation } from 'react-i18next'
import { planckToUnitBn } from 'utils'

export const PoolMemberBonded = ({ member }: { member: FetchedPoolMember }) => {
  const { t } = useTranslation('app')
  const { network } = useNetwork()
  const { unit, units } = getNetworkData(network)

  let bonded = new BigNumber(0)
  let totalUnbonding = new BigNumber(0)

  let status = ''
  const { points, unbondingEras } = member

  bonded = planckToUnitBn(new BigNumber(points), units)
  status = bonded.isGreaterThan(0) ? 'active' : 'inactive'

  // converting unbonding eras from points to units
  let totalUnbondingUnit = new BigNumber(0)
  Object.values(unbondingEras).forEach(([, amount]) => {
    const amountBn = new BigNumber(amount)
    totalUnbondingUnit = totalUnbondingUnit.plus(amountBn)
  })
  totalUnbonding = planckToUnitBn(new BigNumber(totalUnbondingUnit), units)

  return (
    <>
      bonded.isGreaterThan(0) && (
      <ValidatorStatusWrapper $status={status}>
        <h5>
          {t('bonded')}: {bonded.decimalPlaces(3).toFormat()} {unit}
        </h5>
      </ValidatorStatusWrapper>
      )
      {totalUnbonding.isGreaterThan(0) && (
        <ValidatorStatusWrapper $status="inactive">
          <h5>
            {t('unbonding')} {totalUnbonding.decimalPlaces(3).toFormat()} {unit}
          </h5>
        </ValidatorStatusWrapper>
      )}
    </>
  )
}
