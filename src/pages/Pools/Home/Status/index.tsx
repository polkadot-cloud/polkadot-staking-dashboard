// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import {
  faCog,
  faExclamationTriangle,
  faLock,
  faPlus,
  faShare,
  faSignOutAlt,
} from '@fortawesome/free-solid-svg-icons';
import BigNumber from 'bignumber.js';
import { useApi } from 'contexts/Api';
import { useConnect } from 'contexts/Connect';
import { useModal } from 'contexts/Modal';
import { useActivePools } from 'contexts/Pools/ActivePools';
import { useBondedPools } from 'contexts/Pools/BondedPools';
import { useTransferOptions } from 'contexts/TransferOptions';
import { useUi } from 'contexts/UI';
import { CardWrapper } from 'library/Graphs/Wrappers';
import { useNominationStatus } from 'library/Hooks/useNominationStatus';
import { Stat } from 'library/Stat';
import { useTranslation } from 'react-i18next';
import { determinePoolDisplay, planckToUnit } from 'Utils';
import { Separator } from 'Wrappers';
import { useStatusButtons } from './useStatusButtons';

export const Status = ({ height }: { height: number }) => {
  const { t } = useTranslation('pages');
  const {
    network: { units, unit },
    isReady,
  } = useApi();
  const { activeAccount, isReadOnlyAccount } = useConnect();
  const { poolsSyncing } = useUi();
  const {
    selectedActivePool,
    poolNominations,
    isOwner,
    isStateToggler,
    isMember,
    isDepositor,
  } = useActivePools();
  const { bondedPools, meta } = useBondedPools();
  const { openModalWith } = useModal();
  const poolStash = selectedActivePool?.addresses?.stash || '';
  const { getNominationStatus } = useNominationStatus();
  const { getTransferOptions } = useTransferOptions();
  const { earningRewards, activeNominees } = getNominationStatus(
    poolStash,
    'pool'
  );
  const { label, buttons } = useStatusButtons();
  const { active } = getTransferOptions(activeAccount).pool;

  // determine pool state
  const poolState = selectedActivePool?.bondedPool?.state ?? null;
  const poolNominating = !!poolNominations?.targets?.length;

  // determine membership display.
  let membershipDisplay = t('pools.notInPool');
  if (selectedActivePool) {
    const pool = bondedPools.find((p: any) => {
      return p.addresses.stash === selectedActivePool.addresses.stash;
    });

    if (pool) {
      const metadata = meta.bonded_pools?.metadata ?? [];
      const batchIndex = bondedPools.indexOf(pool);
      membershipDisplay = determinePoolDisplay(
        selectedActivePool.addresses.stash,
        metadata[batchIndex]
      );
    }
  }

  // Set the minimum unclaimed planck value to prevent e numbers
  const minUnclaimedDisplay = new BigNumber(1_000_000);

  // Unclaimed rewards `Stat` props
  let { unclaimedRewards } = selectedActivePool || {};
  unclaimedRewards = unclaimedRewards ?? new BigNumber(0);

  const labelRewards = unclaimedRewards.isGreaterThan(minUnclaimedDisplay)
    ? `${planckToUnit(unclaimedRewards, units)} ${unit}`
    : `0 ${unit}`;

  // Membership buttons
  const membershipButtons = [];
  if (poolState !== 'Destroying' && (isOwner() || isStateToggler())) {
    membershipButtons.push({
      title: t('pools.manage'),
      icon: faCog,
      disabled: !isReady || isReadOnlyAccount(activeAccount),
      small: true,
      onClick: () => openModalWith('ManagePool', {}, 'small'),
    });
  }

  if (isMember() && !isDepositor() && active?.isGreaterThan(0)) {
    membershipButtons.push({
      title: t('pools.leave'),
      icon: faSignOutAlt,
      disabled: !isReady || isReadOnlyAccount(activeAccount),
      small: true,
      onClick: () => openModalWith('LeavePool', { bondFor: 'pool' }, 'small'),
    });
  }

  // Reward buttons
  const buttonsRewards = unclaimedRewards.isGreaterThan(minUnclaimedDisplay)
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
            poolState === 'Destroying',
          small: true,
          onClick: () =>
            openModalWith('ClaimReward', { claimType: 'bond' }, 'small'),
        },
      ]
    : undefined;

  let poolStateIcon;
  switch (poolState) {
    case 'Blocked':
      poolStateIcon = faLock;
      break;
    case 'Destroying':
      poolStateIcon = faExclamationTriangle;
      break;
    default:
      poolStateIcon = undefined;
  }

  // determine pool status - left side
  const poolStatusLeft =
    poolState === 'Blocked'
      ? `${t('pools.locked')} / `
      : poolState === 'Destroying'
      ? `${t('pools.destroying')} / `
      : '';

  // determine pool status - right side
  const poolStatusRight = poolsSyncing
    ? t('pools.inactivePoolNotNominating')
    : !poolNominating
    ? t('pools.inactivePoolNotNominating')
    : activeNominees.length
    ? `${t('pools.nominatingAnd')} ${
        earningRewards
          ? t('pools.earningRewards')
          : t('pools.notEarningRewards')
      }`
    : t('pools.waitingForActiveNominations');

  return (
    <CardWrapper height={height}>
      {selectedActivePool ? (
        <>
          <Stat
            label={label}
            helpKey="Pool Membership"
            stat={{
              address: selectedActivePool?.addresses?.stash ?? '',
              display: membershipDisplay,
            }}
            buttons={membershipButtons}
          />
        </>
      ) : (
        <Stat
          label={t('pools.poolMembership')}
          helpKey="Pool Membership"
          stat={t('pools.notInPool') || ''}
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
