// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import BigNumber from 'bignumber.js'
import { PerbillMultiplier } from 'consts'
import { usePoolCommission } from 'hooks/usePoolCommission'
import { useSyncing } from 'hooks/useSyncing'
import { FavoritePool } from 'library/ListItem/Buttons/FavoritePool'
import { PoolBonded } from 'library/ListItem/Labels/PoolBonded'
import { PoolCommission } from 'library/ListItem/Labels/PoolCommission'
import { PoolIdentity } from 'library/ListItem/Labels/PoolIdentity'
import { PoolNominateStatus } from 'library/ListItem/Labels/PoolNominateStatus'
import { Wrapper } from 'library/ListItem/Wrappers'
import { usePoolsTabs } from 'pages/Pools/context'
import { memo } from 'react'
import { HeaderButtonRow, LabelRow, Separator } from 'ui-core/list'
import { deepEqual } from 'ui-graphs/util/deepEqual'
import { More } from '../ListItem/Buttons/More'
import { Members } from '../ListItem/Labels/Members'
import { PoolId } from '../ListItem/Labels/PoolId'
import type { PoolProps } from './types'

const PoolComponent = ({ pool }: PoolProps) => {
  const { memberCounter, addresses, id } = pool
  const { setActiveTab } = usePoolsTabs()
  const { syncing } = useSyncing(['active-pools'])
  const { getCurrentCommission } = usePoolCommission()

  const currentCommission = getCurrentCommission(id)

  return (
    <Wrapper className="pool">
      <div className="inner">
        <div className="row top">
          <PoolIdentity pool={pool} />
          <div>
            <HeaderButtonRow>
              <FavoritePool address={addresses.stash} />
              <More
                pool={pool}
                setActiveTab={setActiveTab}
                disabled={syncing}
              />
            </HeaderButtonRow>
          </div>
        </div>
        <Separator />
        <div className="row bottom lg pools">
          <div>
            <PoolNominateStatus pool={pool} />
          </div>
          <div>
            <LabelRow>
              {currentCommission > 0 && (
                <PoolCommission
                  commission={`${new BigNumber(currentCommission / PerbillMultiplier).decimalPlaces(3).toFormat()}%`}
                />
              )}
              <PoolId id={id} />
              <Members memberCounter={memberCounter} />
              <PoolBonded pool={pool} />
            </LabelRow>
          </div>
        </div>
      </div>
    </Wrapper>
  )
}

// Custom comparison function to prevent unnecessary re-renders
const arePropsEqual = (prevProps: PoolProps, nextProps: PoolProps): boolean => {
  const prevPool = prevProps.pool
  const nextPool = nextProps.pool

  // Check core pool identifiers
  if (
    prevPool.id !== nextPool.id ||
    prevPool.addresses.stash !== nextPool.addresses.stash ||
    prevPool.memberCounter !== nextPool.memberCounter ||
    prevPool.state !== nextPool.state
  ) {
    return false
  }

  // Check pool metadata changes using deepEqual
  if (
    prevPool.addresses.reward !== nextPool.addresses.reward ||
    !deepEqual(prevPool.addresses, nextPool.addresses)
  ) {
    return false
  }

  // Check bonded amount changes
  if (prevPool.points !== nextPool.points) {
    return false
  }

  // Check commission changes using deepEqual
  if (!deepEqual(prevPool.commission, nextPool.commission)) {
    return false
  }

  // Check roles changes using deepEqual
  if (!deepEqual(prevPool.roles, nextPool.roles)) {
    return false
  }

  return true
}

export const Pool = memo(PoolComponent, arePropsEqual)
Pool.displayName = 'Pool'
