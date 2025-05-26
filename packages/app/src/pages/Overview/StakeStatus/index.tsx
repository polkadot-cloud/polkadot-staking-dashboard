// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useActivePool } from 'contexts/Pools/ActivePool'
import { useStaking } from 'contexts/Staking'
import { CardWrapper } from 'library/Card/Wrappers'
import { NominationStatus } from 'pages/Nominate/Active/Status/NominationStatus'
import { MembershipStatus } from 'pages/Pools/Status/MembershipStatus'
import { Page } from 'ui-core/base'
import { Tips } from './Tips'
import { StatusWrapper } from './Wrappers'

export const StakeStatus = ({ height }: { height: number }) => {
  const { inPool } = useActivePool()
  const { isNominator } = useStaking()

  const notStaking = !inPool && !isNominator
  const showNominate = notStaking || isNominator
  const showMembership = notStaking || inPool

  return (
    <CardWrapper style={{ padding: 0 }} height={height}>
      <StatusWrapper>
        {showNominate && (
          <Page.RowSection
            secondary={showMembership}
            standalone={!showMembership}
          >
            <section>
              <NominationStatus />
            </section>
          </Page.RowSection>
        )}
        {showMembership && (
          <Page.RowSection
            hLast={showNominate}
            vLast={showNominate}
            standalone={true}
          >
            <section>
              <MembershipStatus showButtons={false} />
            </section>
          </Page.RowSection>
        )}
      </StatusWrapper>
      <Tips />
    </CardWrapper>
  )
}
