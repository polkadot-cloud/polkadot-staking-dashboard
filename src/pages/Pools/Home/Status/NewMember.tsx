// Copyright 2024 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { CallToActionWrapper } from '../../../../library/CallToAction';
import {
  faChevronRight,
  faUserGroup,
  faUserPlus,
} from '@fortawesome/free-solid-svg-icons';
import { useSetup } from 'contexts/Setup';
import { useStatusButtons } from './useStatusButtons';
import { useTranslation } from 'react-i18next';
import { useOverlay } from 'kits/Overlay/Provider';
import type { NewMemberProps } from './types';
import { CallToActionLoader } from 'library/Loader/CallToAction';
import { usePoolPerformance } from 'contexts/Pools/PoolPerformance';
import { FindingPoolsPercent } from './FindingPoolPercent';
import { useJoinPools } from 'contexts/Pools/JoinPools';

export const NewMember = ({ syncing }: NewMemberProps) => {
  const { t } = useTranslation();
  const { setOnPoolSetup } = useSetup();
  const { poolsForJoin } = useJoinPools();
  const { openCanvas } = useOverlay().canvas;
  const { startJoinPoolFetch } = useJoinPools();
  const { getPoolPerformanceTask } = usePoolPerformance();
  const { getJoinDisabled, getCreateDisabled } = useStatusButtons();

  // Get the pool performance task to determine if performance data is ready.
  const poolJoinPerformanceTask = getPoolPerformanceTask('pool_join');

  // Alias for create button disabled state.
  const createDisabled = getCreateDisabled();

  // Disable opening the canvas if data is not ready.
  const joinButtonDisabled = getJoinDisabled() || !poolsForJoin.length;

  return (
    <CallToActionWrapper>
      <div className="inner">
        {syncing ? (
          <CallToActionLoader />
        ) : (
          <>
            <section className="fixedWidth">
              <div className="buttons">
                <div
                  className={`button primary standalone${getJoinDisabled() ? ` disabled` : ``}${poolJoinPerformanceTask.status === 'synced' ? ` pulse` : ``}${poolJoinPerformanceTask.status === 'syncing' ? ` inactive` : ``}`}
                >
                  <button
                    onClick={() => {
                      // Start sync process, otherwise, open canvas.
                      if (poolJoinPerformanceTask.status === 'unsynced') {
                        startJoinPoolFetch();
                      } else if (poolJoinPerformanceTask.status === 'synced') {
                        openCanvas({
                          key: 'JoinPool',
                          options: {},
                          size: 'xl',
                        });
                      } else {
                        // Syncing in progress, don't do anything.
                        return;
                      }
                    }}
                    disabled={joinButtonDisabled}
                  >
                    {poolJoinPerformanceTask.status === 'unsynced' && (
                      <>
                        {t('pools.joinPool', { ns: 'pages' })}
                        <FontAwesomeIcon icon={faUserGroup} />
                      </>
                    )}

                    {poolJoinPerformanceTask.status === 'syncing' && (
                      <>
                        {t('syncingPoolData', { ns: 'library' })}{' '}
                        <div className="loader"></div>
                      </>
                    )}

                    {poolJoinPerformanceTask.status === 'synced' && (
                      <>
                        Ready to Join Pool
                        <FontAwesomeIcon icon={faUserPlus} />
                      </>
                    )}

                    <FindingPoolsPercent />
                  </button>
                </div>
              </div>
            </section>
            <section>
              <div className="buttons">
                <div
                  className={`button secondary standalone${createDisabled ? ` disabled` : ``}`}
                >
                  <button
                    onClick={() => setOnPoolSetup(true)}
                    disabled={createDisabled}
                  >
                    {t('pools.createPool', { ns: 'pages' })}
                    <FontAwesomeIcon
                      icon={faChevronRight}
                      transform={'shrink-4'}
                    />
                  </button>
                </div>
              </div>
            </section>
          </>
        )}
      </div>
    </CallToActionWrapper>
  );
};
