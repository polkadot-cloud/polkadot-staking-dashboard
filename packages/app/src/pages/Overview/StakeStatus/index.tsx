// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { usePlugins } from 'contexts/Plugins'
import { useStaking } from 'contexts/Staking'
import { CardWrapper } from 'library/Card/Wrappers'
import { NominationStatus } from 'pages/Nominate/Active/Status/NominationStatus'
import { MembershipStatus } from 'pages/Pools/Status/MembershipStatus'
import { RowSection } from 'ui-structure'
import { Tips } from './Tips'
import { StatusWrapper } from './Wrappers'

export const StakeStatus = () => {
  const { plugins } = usePlugins()
  const { isNominating } = useStaking()
  const showTips = plugins.includes('tips')

  return (
    <CardWrapper style={{ padding: 0 }}>
      <StatusWrapper $borderBottom={showTips}>
        <RowSection secondary>
          <section>
            <NominationStatus showButtons={false} />
          </section>
        </RowSection>
        <RowSection hLast vLast>
          <section
            style={{ opacity: isNominating() ? 'var(--opacity-disabled)' : 1 }}
          >
            <MembershipStatus showButtons={false} />
          </section>
        </RowSection>
      </StatusWrapper>

      {showTips ? <Tips /> : null}
    </CardWrapper>
  )
}
