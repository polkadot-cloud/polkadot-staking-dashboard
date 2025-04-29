// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { getChainIcons } from 'assets'
import BigNumber from 'bignumber.js'
import { getNetworkData } from 'consts/util'
import { useApi } from 'contexts/Api'
import { useNetwork } from 'contexts/Network'
import { useStaking } from 'contexts/Staking'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Stat, Subheading } from 'ui-core/canvas'
import { planckToUnitBn } from 'utils'
import type { OverviewSectionProps } from '../types'

export const Stats = ({
  bondedPool,
}: OverviewSectionProps & {
  graphSyncing?: boolean
}) => {
  const { t } = useTranslation('app')
  const { network } = useNetwork()
  const { eraStakers } = useStaking()
  const { isReady, serviceApi } = useApi()

  const { unit, units } = getNetworkData(network)
  const Token = getChainIcons(network).token
  const isActive = eraStakers.stakers.find((staker) =>
    staker.others.find((other) => other.who === bondedPool.addresses.stash)
  )

  // Store the pool balance.
  const [poolBalance, setPoolBalance] = useState<BigNumber | null>(null)

  // Fetches the balance of the bonded pool.
  const getPoolBalance = async () => {
    const apiResult = await serviceApi.runtimeApi.pointsToBalance(
      bondedPool.id,
      BigInt(bondedPool.points)
    )
    const balance = new BigNumber(apiResult || 0)

    if (balance) {
      setPoolBalance(new BigNumber(balance))
    }
  }

  // Fetch the balance when pool or points change.
  useEffect(() => {
    if (isReady) {
      getPoolBalance()
    }
  }, [bondedPool.id, bondedPool.points, isReady])

  return (
    <Subheading>
      <h4>
        {isActive && <Stat>{t('activelyNominating')}</Stat>}
        <Stat withIcon>
          <Token />
          <span>
            {!poolBalance
              ? `...`
              : `${planckToUnitBn(poolBalance, units)
                  .decimalPlaces(3)
                  .toFormat()} ${unit} ${t('bonded')}`}
          </span>
        </Stat>
      </h4>
    </Subheading>
  )
}
