// Copyright 2024 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { CardWrapper } from 'library/Card/Wrappers';
import { UnclaimedPayoutsStatus } from './UnclaimedPayoutsStatus';
import { NominationStatus } from './NominationStatus';
import { PayoutDestinationStatus } from './PayoutDestinationStatus';
import { Separator } from 'kits/Structure/Separator';
import { useSyncing } from 'hooks/useSyncing';
import { useStaking } from 'contexts/Staking';
import { NewNominator } from './NewNominator';
import { useActiveAccounts } from 'contexts/ActiveAccounts';
import { useImportedAccounts } from 'contexts/Connect/ImportedAccounts';

export const Status = ({ height }: { height: number }) => {
  const { syncing } = useSyncing();
  const { inSetup } = useStaking();
  const { activeAccount } = useActiveAccounts();
  const { isReadOnlyAccount } = useImportedAccounts();

  return (
    <CardWrapper
      height={height}
      className={!syncing && inSetup() ? 'prompt' : undefined}
    >
      <NominationStatus />
      <Separator />
      <UnclaimedPayoutsStatus dimmed={inSetup()} />

      {!syncing ? (
        !inSetup() ? (
          <>
            <Separator />
            <PayoutDestinationStatus />
          </>
        ) : (
          !isReadOnlyAccount(activeAccount) && (
            <NewNominator syncing={syncing} />
          )
        )
      ) : (
        <NewNominator syncing={syncing} />
      )}
    </CardWrapper>
  );
};
