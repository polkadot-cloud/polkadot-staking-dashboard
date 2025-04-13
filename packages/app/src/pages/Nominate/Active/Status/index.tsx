// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useActiveAccounts } from 'contexts/ActiveAccounts'
import { useImportedAccounts } from 'contexts/Connect/ImportedAccounts'
import { usePlugins } from 'contexts/Plugins'
import { useStaking } from 'contexts/Staking'
import { useSyncing } from 'hooks/useSyncing'
import { CardWrapper } from 'library/Card/Wrappers'
import { Separator } from 'ui-core/base'
import { NewNominator } from './NewNominator'
import { NominationStatus } from './NominationStatus'
import { PayoutDestinationStatus } from './PayoutDestinationStatus'
import { UnclaimedPayoutsStatus } from './UnclaimedPayoutsStatus'

export const Status = ({ height }: { height: number }) => {
  const { syncing } = useSyncing()
  const { inSetup } = useStaking()
  const { pluginEnabled } = usePlugins()
  const { activeAddress } = useActiveAccounts()
  const { isReadOnlyAccount } = useImportedAccounts()

  return (
    <CardWrapper
      height={height}
      className={!syncing && inSetup() ? 'prompt' : undefined}
    >
      <NominationStatus />
      <Separator />
      <UnclaimedPayoutsStatus
        dimmed={inSetup() || !pluginEnabled('staking_api')}
      />

      {!syncing ? (
        !inSetup() ? (
          <>
            <Separator />
            <PayoutDestinationStatus />
          </>
        ) : (
          !isReadOnlyAccount(activeAddress) && (
            <NewNominator syncing={syncing} />
          )
        )
      ) : (
        <NewNominator syncing={syncing} />
      )}
    </CardWrapper>
  )
}
