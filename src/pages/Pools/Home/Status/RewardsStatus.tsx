// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { faCircleDown, faPlus } from '@fortawesome/free-solid-svg-icons';
import { planckToUnit } from '@polkadot-cloud/utils';
import BigNumber from 'bignumber.js';
import { useTranslation } from 'react-i18next';
import { useApi } from 'contexts/Api';
import { useActivePools } from 'contexts/Pools/ActivePools';
import { useUi } from 'contexts/UI';
import { Stat } from 'library/Stat';
import { useOverlay } from '@polkadot-cloud/react/hooks';
import { useNetwork } from 'contexts/Network';
import { useActiveAccounts } from 'contexts/ActiveAccounts';
import { useImportedAccounts } from 'contexts/Connect/ImportedAccounts';

export const RewardsStatus = () => {
  const { t } = useTranslation('pages');
  const {
    networkData: { units },
  } = useNetwork();
  const { isReady } = useApi();
  const { isPoolSyncing } = useUi();
  const { openModal } = useOverlay().modal;
  const { activeAccount } = useActiveAccounts();
  const { selectedActivePool } = useActivePools();
  const { isReadOnlyAccount } = useImportedAccounts();

  let { pendingRewards } = selectedActivePool || {};
  pendingRewards = pendingRewards ?? new BigNumber(0);

  // Set the minimum unclaimed planck value to prevent e numbers.
  const minUnclaimedDisplay = new BigNumber(1_000_000);

  const labelRewards = pendingRewards.isGreaterThan(minUnclaimedDisplay)
    ? planckToUnit(pendingRewards, units).toString()
    : '0';

  // Display Reward buttons if unclaimed rewards is a non-zero value.
  const buttonsRewards = pendingRewards.isGreaterThan(minUnclaimedDisplay)
    ? [
        {
          title: t('pools.withdraw'),
          icon: faCircleDown,
          disabled: !isReady || isReadOnlyAccount(activeAccount),
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
            !isReady ||
            isReadOnlyAccount(activeAccount) ||
            selectedActivePool?.bondedPool?.state === 'Destroying',
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
      buttons={isPoolSyncing ? [] : buttonsRewards}
    />
  );
};
