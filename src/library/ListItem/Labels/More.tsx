// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { faCaretRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useTranslation } from 'react-i18next';
import { useOverlay } from 'kits/Overlay/Provider';
import { usePoolPerformance } from 'contexts/Pools/PoolPerformance';
import type { BondedPool } from 'contexts/Pools/BondedPools/types';

export const More = ({
  pool,
  setActiveTab,
  disabled,
}: {
  pool: BondedPool;
  setActiveTab: (t: number) => void;
  disabled: boolean;
}) => {
  const { t } = useTranslation('tips');
  const { openCanvas } = useOverlay().canvas;
  const { startPoolRewardPointsFetch } = usePoolPerformance();

  const { id, addresses } = pool;

  // Define a unique pool performance data key
  const performanceKey = `pool_page_standalone_${id}`;

  return (
    <div className="label button-with-text">
      <button
        type="button"
        onClick={() => {
          startPoolRewardPointsFetch(performanceKey, [addresses.stash]);
          openCanvas({
            key: 'JoinPool',
            options: {
              providedPool: {
                id,
                performanceBatchKey: performanceKey,
              },
              onJoinCallback: () => setActiveTab(0),
            },
            size: 'xl',
          });
        }}
        disabled={disabled}
      >
        {t('module.more')}
        <FontAwesomeIcon icon={faCaretRight} transform="shrink-2" />
      </button>
    </div>
  );
};
