// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { CallToActionWrapper } from 'library/CallToAction';
import { faUserPlus } from '@fortawesome/free-solid-svg-icons';
import { useStatusButtons } from './useStatusButtons';
import { useTranslation } from 'react-i18next';
import { useOverlay } from 'kits/Overlay/Provider';
import type { NewMemberProps } from './types';
import { CallToActionLoader } from 'library/Loader/CallToAction';
import { usePoolPerformance } from 'contexts/Pools/PoolPerformance';
import { PoolSync } from 'library/PoolSync';
import { useJoinPools } from 'contexts/Pools/JoinPools';
import { StyledLoader } from 'library/PoolSync/Loader';
import { usePoolsTabs } from '../context';

export const NewMember = ({ syncing }: NewMemberProps) => {
  const { t } = useTranslation();
  const { poolsForJoin } = useJoinPools();
  const { setActiveTab } = usePoolsTabs();
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
                  className={`button primary standalone${getJoinDisabled() ? ` disabled` : ``}${poolJoinPerformanceTask.status === 'synced' ? ` pulse` : ``}`}
                >
                  <button
                    onClick={() => {
                      // Start sync process, otherwise, open canvas.
                      if (poolJoinPerformanceTask.status === 'unsynced') {
                        startJoinPoolFetch();
                      }

                      openCanvas({
                        key: 'JoinPool',
                        options: {},
                        size: 'xl',
                      });
                    }}
                    disabled={joinButtonDisabled}
                  >
                    {poolJoinPerformanceTask.status === 'unsynced' && (
                      <>
                        {t('pools.joinPool', { ns: 'pages' })}
                        <FontAwesomeIcon icon={faUserPlus} />
                      </>
                    )}

                    {poolJoinPerformanceTask.status === 'syncing' && (
                      <>
                        {t('syncingPoolData', { ns: 'library' })}{' '}
                        <StyledLoader />
                      </>
                    )}

                    {poolJoinPerformanceTask.status === 'synced' && (
                      <>
                        {t('readyToJoinPool', { ns: 'library' })}
                        <FontAwesomeIcon icon={faUserPlus} />
                      </>
                    )}
                    <PoolSync performanceKey="pool_join" />
                  </button>
                </div>
              </div>
            </section>
            <section>
              <div className="buttons">
                <div
                  className={`button standalone secondary ${createDisabled ? ` disabled` : ``}`}
                >
                  <button
                    onClick={() =>
                      openCanvas({
                        key: 'CreatePool',
                        options: {},
                        size: 'xl',
                      })
                    }
                    disabled={createDisabled}
                  >
                    {t('pools.createPool', { ns: 'pages' })}
                  </button>
                </div>
                <div className={`button standalone secondary`}>
                  <button onClick={() => setActiveTab(1)}>
                    {t('pools.browsePools', { ns: 'pages' })}
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
