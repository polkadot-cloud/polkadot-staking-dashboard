// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { faPlus, faShare } from '@fortawesome/free-solid-svg-icons';
import { planckToUnit } from '@polkadot-cloud/utils';
import BigNumber from 'bignumber.js';
import { useTranslation } from 'react-i18next';
import { useApi } from 'contexts/Api';
import { useConnect } from 'contexts/Connect';
import { useActivePools } from 'contexts/Pools/ActivePools';
import { useUi } from 'contexts/UI';
import { Stat } from 'library/Stat';
import { useOverlay } from '@polkadot-cloud/react/hooks';

export const RewardsStatus = () => {
  const { t } = useTranslation('pages');
  const {
    network: { units, unit },
    isReady,
  } = useApi();
  const { isPoolSyncing } = useUi();
  const { openModal } = useOverlay().modal;
  const { selectedActivePool } = useActivePools();
  const { activeAccount, isReadOnlyAccount } = useConnect();

  let { pendingRewards } = selectedActivePool || {};
  pendingRewards = pendingRewards ?? new BigNumber(0);

  // Set the minimum unclaimed planck value to prevent e numbers.
  const minUnclaimedDisplay = new BigNumber(1_000_000);

  const labelRewards = pendingRewards.isGreaterThan(minUnclaimedDisplay)
    ? `${planckToUnit(pendingRewards, units)} ${unit}`
    : `0 ${unit}`;

  // Display Reward buttons if unclaimed rewards is a non-zero value.
  const buttonsRewards = pendingRewards.isGreaterThan(minUnclaimedDisplay)
    ? [
        {
          title: t('pools.withdraw'),
          icon: faShare,
          disabled: !isReady || isReadOnlyAccount(activeAccount),
          small: true,
          onClick: () =>
            openModal({
              key: 'ClaimReward',
              options: { claimType: 'withdraw' },
              size: 'small',
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
              size: 'small',
            }),
        },
      ]
    : undefined;

  return (
    <Stat
      label={t('pools.unclaimedRewards')}
      helpKey="Pool Rewards"
      stat={labelRewards}
      buttons={isPoolSyncing ? [] : buttonsRewards}
    />
  );
};
