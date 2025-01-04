// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { usePlugins } from 'contexts/Plugins'
import { useActivePool } from 'contexts/Pools/ActivePool'
import { useStaking } from 'contexts/Staking'
import { CardWrapper } from 'library/Card/Wrappers'
import { NominationStatus } from 'pages/Nominate/Active/Status/NominationStatus'
import { MembershipStatus } from 'pages/Pools/Status/MembershipStatus'
import { RowSection } from 'ui-core/base'
import { Tips } from './Tips'
import { StatusWrapper } from './Wrappers'

export const StakeStatus = () => {
  const { plugins } = usePlugins()
  const { inPool } = useActivePool()
  const { inSetup } = useStaking()

  const showTips = plugins.includes('tips')
  const notStaking = !inPool() && inSetup()
  const showNominate = notStaking || !inSetup()
  const showMembership = notStaking || inPool()

  return (
    <CardWrapper style={{ padding: 0 }}>
      <StatusWrapper $borderBottom={showTips}>
        {showNominate && (
          <RowSection secondary={showMembership} standalone={!showMembership}>
            <section>
              <NominationStatus showButtons={false} />
            </section>
          </RowSection>
        )}
        {showMembership && (
          <RowSection
            hLast={showNominate}
            vLast={showNominate}
            standalone={!showNominate}
          >
            <section>
              <MembershipStatus showButtons={false} />
            </section>
          </RowSection>
        )}
      </StatusWrapper>

      {showTips ? <Tips /> : null}
    </CardWrapper>
  )
}
