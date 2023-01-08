// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import {
  faExclamationTriangle,
  faLock,
  faPlus,
  faShare,
} from '@fortawesome/free-solid-svg-icons';
import BN from 'bn.js';
import { useApi } from 'contexts/Api';
import { useConnect } from 'contexts/Connect';
import { useModal } from 'contexts/Modal';
import { useActivePools } from 'contexts/Pools/ActivePools';
import { useUi } from 'contexts/UI';
import { CardWrapper } from 'library/Graphs/Wrappers';
import { useNominationStatus } from 'library/Hooks/useNominationStatus';
import { Stat } from 'library/Stat';
import { useTranslation } from 'react-i18next';
import { planckBnToUnit } from 'Utils';
import { Separator } from 'Wrappers';
import { Membership } from './Membership';
import { useStatusButtons } from './useStatusButtons';

export const Status = ({ height }: { height: number }) => {
  const { t } = useTranslation('pages');
  const { network, isReady } = useApi();
  const { activeAccount, isReadOnlyAccount } = useConnect();
  const { units, unit } = network;
  const { poolsSyncing } = useUi();
  const { selectedActivePool, poolNominations } = useActivePools();
  const { openModalWith } = useModal();
  const poolStash = selectedActivePool?.addresses?.stash || '';
  const { getNominationStatus } = useNominationStatus();
  const { earningRewards, activeNominees } = getNominationStatus(
    poolStash,
    'pool'
  );

  // determine pool state
  const poolState = selectedActivePool?.bondedPool?.state ?? null;

  const isNominating = !!poolNominations?.targets?.length;

  // Set the minimum unclaimed planck value to prevent e numbers
  const minUnclaimedDisplay = new BN(1_000_000);

  // Unclaimed rewards `Stat` props
  let { unclaimedRewards } = selectedActivePool || {};
  unclaimedRewards = unclaimedRewards ?? new BN(0);

  const labelRewards = unclaimedRewards.gt(minUnclaimedDisplay)
    ? `${planckBnToUnit(unclaimedRewards, units)} ${unit}`
    : `0 ${unit}`;

  const buttonsRewards = unclaimedRewards.gt(minUnclaimedDisplay)
    ? [
        {
          title: t('pools.withdraw'),
          icon: faShare,
          disabled: !isReady || isReadOnlyAccount(activeAccount),
          small: true,
          onClick: () =>
            openModalWith('ClaimReward', { claimType: 'withdraw' }, 'small'),
        },
        {
          title: t('pools.bond'),
          icon: faPlus,
          disabled:
            !isReady ||
            isReadOnlyAccount(activeAccount) ||
            poolState === 'destroying',
          small: true,
          onClick: () =>
            openModalWith('ClaimReward', { claimType: 'bond' }, 'small'),
        },
      ]
    : undefined;

  let poolStateIcon;
  switch (poolState) {
    case 'blocked':
      poolStateIcon = faLock;
      break;
    case 'destroying':
      poolStateIcon = faExclamationTriangle;
      break;
    default:
      poolStateIcon = undefined;
  }

  // determine pool status - left side
  const poolStatusLeft =
    poolState === 'blocked'
      ? `${t('pools.locked')} / `
      : poolState === 'destroying'
      ? `${t('pools.destroying')} / `
      : '';

  // determine pool status - right side
  const poolStatusRight = poolsSyncing
    ? t('pools.inactivePoolNotNominating')
    : !isNominating
    ? t('pools.inactivePoolNotNominating')
    : activeNominees.length
    ? `${t('pools.nominatingAnd')} ${
        earningRewards
          ? t('pools.earningRewards')
          : t('pools.notEarningRewards')
      }`
    : t('pools.waitingForActiveNominations');

  const { label, buttons } = useStatusButtons();

  return (
    <CardWrapper height={height}>
      {selectedActivePool ? (
        <Membership label={label} />
      ) : (
        <Stat
          label={t('pools.poolMembership')}
          helpKey="Pool Membership"
          stat={t('pools.notInPool')}
          buttons={poolsSyncing ? [] : buttons}
        />
      )}
      <Separator />
      <Stat
        label={t('pools.unclaimedRewards')}
        helpKey="Pool Rewards"
        stat={labelRewards}
        buttons={poolsSyncing ? [] : buttonsRewards}
      />
      {selectedActivePool && (
        <>
          <Separator />
          <Stat
            icon={poolsSyncing ? undefined : poolStateIcon}
            label={t('pools.poolStatus')}
            helpKey="Nomination Status"
            stat={`${poolStatusLeft}${poolStatusRight}`}
          />
        </>
      )}
    </CardWrapper>
  );
};

export default Status;
