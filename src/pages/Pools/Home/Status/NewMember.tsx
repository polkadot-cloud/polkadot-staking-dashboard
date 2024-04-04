// Copyright 2024 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { CallToActionWrapper } from '../../../../library/CallToAction';
import { faChevronRight, faUserGroup } from '@fortawesome/free-solid-svg-icons';
import { useSetup } from 'contexts/Setup';
import { useStatusButtons } from './useStatusButtons';
import { useTranslation } from 'react-i18next';
import { useOverlay } from 'kits/Overlay/Provider';
import type { NewMemberProps } from './types';
import { CallToActionLoader } from 'library/Loader/CallToAction';
import { usePoolPerformance } from 'contexts/Pools/PoolPerformance';
import { FindingPoolsPercent } from './FindingPoolPercent';

export const NewMember = ({ syncing }: NewMemberProps) => {
  const { t } = useTranslation();
  const { setOnPoolSetup } = useSetup();
  const { openCanvas } = useOverlay().canvas;
  const { getPoolPerformanceTask } = usePoolPerformance();
  const { getJoinDisabled, getCreateDisabled } = useStatusButtons();

  // Get the pool performance task to determine if performance data is ready.
  const poolJoinPerformanceTask = getPoolPerformanceTask('pool_join');

  // Disable opening the canvas if data is not ready.
  const joinButtonDisabled =
    getJoinDisabled() || poolJoinPerformanceTask.status !== 'synced';

  // Alias for create button disabled state.
  const createDisabled = getCreateDisabled();

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
                  className={`button primary standalone${getJoinDisabled() ? ` disabled` : ``}`}
                >
                  <button
                    onClick={() =>
                      openCanvas({
                        key: 'JoinPool',
                        options: {},
                        size: 'xl',
                      })
                    }
                    disabled={joinButtonDisabled}
                  >
                    {poolJoinPerformanceTask.status !== 'synced' ? (
                      <>{t('syncingPoolData', { ns: 'library' })}</>
                    ) : (
                      <>
                        {t('pools.joinPool', { ns: 'pages' })}
                        <FontAwesomeIcon icon={faUserGroup} />
                      </>
                    )}

                    {poolJoinPerformanceTask.status !== 'synced' && (
                      <div className="loader"></div>
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
