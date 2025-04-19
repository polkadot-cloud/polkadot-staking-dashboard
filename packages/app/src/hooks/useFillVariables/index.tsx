// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { capitalizeFirstLetter } from '@w3ux/utils'
import BigNumber from 'bignumber.js'
import { MaxNominations } from 'consts'
import { getNetworkData } from 'consts/util'
import { useApi } from 'contexts/Api'
import { useNetwork } from 'contexts/Network'
import type { AnyJson } from 'types'
import { planckToUnitBn } from 'utils'
import { useErasPerDay } from '../useErasPerDay'

export const useFillVariables = () => {
  const {
    getConsts,
    getChainSpec,
    stakingMetrics: { minimumActiveStake },
    poolsConfig: { minJoinBond, minCreateBond },
  } = useApi()
  const { network } = useNetwork()
  const { maxSupportedDays } = useErasPerDay()
  const { maxExposurePageSize } = getConsts(network)
  const { existentialDeposit } = getChainSpec(network)
  const { unit, units, name } = getNetworkData(network)

  const fillVariables = (d: AnyJson, keys: string[]) => {
    const fields: AnyJson = Object.entries(d).filter(([k]) => keys.includes(k))
    const transformed = Object.entries(fields).map(
      ([, [key, val]]: AnyJson) => {
        const varsToValues = [
          ['{AVERAGE_REWARD_RATE_DAYS}', maxSupportedDays > 30 ? '30' : '15'],
          ['{NETWORK_UNIT}', unit],
          ['{NETWORK_NAME}', capitalizeFirstLetter(name)],
          ['{MAX_EXPOSURE_PAGE_SIZE}', maxExposurePageSize.toString()],
          ['{MAX_NOMINATIONS}', MaxNominations],
          [
            '{MIN_ACTIVE_STAKE}',
            planckToUnitBn(minimumActiveStake, units)
              .decimalPlaces(3)
              .toFormat(),
          ],
          [
            '{MIN_POOL_JOIN_BOND}',
            planckToUnitBn(minJoinBond, units).decimalPlaces(3).toFormat(),
          ],
          [
            '{MIN_POOL_CREATE_BOND}',
            planckToUnitBn(minCreateBond, units).decimalPlaces(3).toFormat(),
          ],
          [
            '{EXISTENTIAL_DEPOSIT}',
            planckToUnitBn(new BigNumber(existentialDeposit), units).toFormat(),
          ],
        ]

        if (val) {
          for (const varToVal of varsToValues) {
            if (val?.constructor === Array) {
              val = val.map((_d) => _d.replaceAll(varToVal[0], varToVal[1]))
            } else {
              val = val.replaceAll(varToVal[0], varToVal[1])
            }
          }
        }
        return [key, val]
      }
    )

    return {
      ...d,
      ...Object.fromEntries(transformed),
    }
  }

  return {
    fillVariables,
  }
}
