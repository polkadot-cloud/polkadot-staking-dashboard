// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { JoinForm } from './JoinForm'

import { useActiveAccounts } from 'contexts/ActiveAccounts'
import { useActivePool } from 'contexts/Pools/ActivePool'
import { useStaking } from 'contexts/Staking'
import { GraphContainer, Interface } from 'ui-core/canvas'
import type { OverviewSectionProps } from '../types'
import { Addresses } from './Addresses'
import { Performance } from './Performance'
import { Roles } from './Roles'
import { Stats } from './Stats'

export const Overview = (props: OverviewSectionProps) => {
  const { inSetup } = useStaking()
  const { inPool } = useActivePool()
  const { activeAddress } = useActiveAccounts()
  const {
    bondedPool: { state },
  } = props
  const showJoinForm =
    activeAddress !== null && state === 'Open' && !inPool() && inSetup()

  return (
    <Interface
      Main={
        <>
          <GraphContainer>
            <Stats {...props} />
            <Performance {...props} />
          </GraphContainer>
          <Addresses {...props} />
          <Roles {...props} />
        </>
      }
      Side={
        showJoinForm ? (
          <div>
            <JoinForm {...props} />
          </div>
        ) : undefined
      }
    />
  )
}
