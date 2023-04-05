// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import {
  faExclamationTriangle,
  faLock,
} from '@fortawesome/free-solid-svg-icons';
import { useActivePools } from 'contexts/Pools/ActivePools';
import { useUi } from 'contexts/UI';
import { useNominationStatus } from 'library/Hooks/useNominationStatus';
import { Stat } from 'library/Stat';
import { useTranslation } from 'react-i18next';

export const PoolStatus = () => {
  const { t } = useTranslation('pages');
  const { isPoolSyncing } = useUi();
  const { getNominationStatus } = useNominationStatus();
  const { selectedActivePool, poolNominations } = useActivePools();

  const poolStash = selectedActivePool?.addresses?.stash || '';
  const { earningRewards, activeNominees } = getNominationStatus(
    poolStash,
    'pool'
  );
  const poolState = selectedActivePool?.bondedPool?.state ?? null;
  const poolNominating = !!poolNominations?.targets?.length;

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
  const poolStatusRight = isPoolSyncing
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
    <Stat
      icon={isPoolSyncing ? undefined : poolStateIcon}
      label={t('pools.poolStatus')}
      helpKey="Nomination Status"
      stat={`${poolStatusLeft}${poolStatusRight}`}
    />
  );
};
