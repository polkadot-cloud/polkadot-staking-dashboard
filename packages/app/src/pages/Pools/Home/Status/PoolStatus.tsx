// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import {
  faExclamationTriangle,
  faLock,
} from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from 'react-i18next';
import { useActivePool } from 'contexts/Pools/ActivePool';
import { useNominationStatus } from 'hooks/useNominationStatus';
import { Stat } from 'library/Stat';
import { useSyncing } from 'hooks/useSyncing';

export const PoolStatus = () => {
  const { t } = useTranslation('pages');
  const { syncing } = useSyncing(['active-pools']);
  const { getNominationStatus } = useNominationStatus();
  const { activePool, activePoolNominations } = useActivePool();

  const poolStash = activePool?.addresses?.stash || '';
  const { earningRewards, nominees } = getNominationStatus(poolStash, 'pool');
  const poolState = activePool?.bondedPool?.state ?? null;
  const poolNominating = !!activePoolNominations?.targets?.length;

  // Determine pool state icon.
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

  // Determine pool status - left side.
  const poolStatusLeft =
    poolState === 'Blocked'
      ? `${t('pools.locked')} / `
      : poolState === 'Destroying'
        ? `${t('pools.destroying')} / `
        : '';

  // Determine pool status - right side.
  const poolStatusRight = syncing
    ? t('pools.inactivePoolNotNominating')
    : !poolNominating
      ? t('pools.inactivePoolNotNominating')
      : nominees.active.length
        ? `${t('pools.nominatingAnd')} ${
            earningRewards
              ? t('pools.earningRewards')
              : t('pools.notEarningRewards')
          }`
        : t('pools.waitingForActiveNominations');

  return (
    <Stat
      icon={syncing ? undefined : poolStateIcon}
      label={t('pools.poolStatus')}
      helpKey="Nomination Status"
      stat={`${poolStatusLeft}${poolStatusRight}`}
    />
  );
};
