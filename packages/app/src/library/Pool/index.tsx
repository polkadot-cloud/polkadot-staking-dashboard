// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { usePoolCommission } from 'hooks/usePoolCommission'
import { useSyncing } from 'hooks/useSyncing'
import { FavoritePool } from 'library/ListItem/Buttons/FavoritePool'
import { PoolBonded } from 'library/ListItem/Labels/PoolBonded'
import { PoolCommission } from 'library/ListItem/Labels/PoolCommission'
import { PoolIdentity } from 'library/ListItem/Labels/PoolIdentity'
import { PoolNominateStatus } from 'library/ListItem/Labels/PoolNominateStatus'
import { Wrapper } from 'library/ListItem/Wrappers'
import { usePoolsTabs } from 'pages/Pools/context'
import { HeaderButtonRow, LabelRow, Separator } from 'ui-core/list'
import { More } from '../ListItem/Buttons/More'
import { Members } from '../ListItem/Labels/Members'
import { PoolId } from '../ListItem/Labels/PoolId'
import type { PoolProps } from './types'

export const Pool = ({ pool }: PoolProps) => {
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
                <PoolCommission commission={`${currentCommission}%`} />
              )}
              <PoolId id={id} />
              <Members members={memberCounter} />
              <PoolBonded pool={pool} />
            </LabelRow>
          </div>
        </div>
      </div>
    </Wrapper>
  )
}
