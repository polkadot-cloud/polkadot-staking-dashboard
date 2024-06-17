// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { faCircleDown, faPlus } from '@fortawesome/free-solid-svg-icons';
import { planckToUnit } from '@w3ux/utils';
import BigNumber from 'bignumber.js';
import { useTranslation } from 'react-i18next';
import { useApi } from 'contexts/Api';
import { useActivePool } from 'contexts/Pools/ActivePool';
import { Stat } from 'library/Stat';
import { useOverlay } from 'kits/Overlay/Provider';
import { useNetwork } from 'contexts/Network';
import { useActiveAccounts } from 'contexts/ActiveAccounts';
import { useImportedAccounts } from 'contexts/Connect/ImportedAccounts';
import { useSyncing } from 'hooks/useSyncing';

export const RewardsStatus = ({ dimmed }: { dimmed: boolean }) => {
  const { t } = useTranslation('pages');
  const {
    networkData: { units },
  } = useNetwork();
  const { isReady } = useApi();
  const { openModal } = useOverlay().modal;
  const { activeAccount } = useActiveAccounts();
  const { syncing } = useSyncing(['active-pools']);
  const { isReadOnlyAccount } = useImportedAccounts();
  const { activePool, pendingPoolRewards } = useActivePool();

  // Set the minimum unclaimed planck value to prevent e numbers.
  const minUnclaimedDisplay = new BigNumber(1_000_000);

  const labelRewards = pendingPoolRewards.isGreaterThan(minUnclaimedDisplay)
    ? planckToUnit(pendingPoolRewards, units).toString()
    : '0';

  // Display Reward buttons if unclaimed rewards is a non-zero value.
  const buttonsRewards = isReadOnlyAccount(activeAccount)
    ? []
    : pendingPoolRewards.isGreaterThan(minUnclaimedDisplay)
      ? [
          {
            title: t('pools.withdraw'),
            icon: faCircleDown,
            disabled: !isReady,
            small: true,
            onClick: () =>
              openModal({
                key: 'ClaimReward',
                options: { claimType: 'withdraw' },
                size: 'sm',
              }),
          },
          {
            title: t('pools.compound'),
            icon: faPlus,
            disabled:
              !isReady || activePool?.bondedPool?.state === 'Destroying',
            small: true,
            onClick: () =>
              openModal({
                key: 'ClaimReward',
                options: { claimType: 'bond' },
                size: 'sm',
              }),
          },
        ]
      : undefined;

  return (
    <Stat
      label={t('pools.unclaimedRewards')}
      helpKey="Pool Rewards"
      type="odometer"
      stat={{ value: labelRewards }}
      dimmed={dimmed}
      buttons={syncing ? [] : buttonsRewards}
    />
  );
};
