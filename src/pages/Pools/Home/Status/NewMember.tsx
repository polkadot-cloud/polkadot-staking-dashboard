// Copyright 2024 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { CallToActionWrapper } from '../../../../library/CallToAction';
import { faChevronRight, faUserGroup } from '@fortawesome/free-solid-svg-icons';
import { useSetup } from 'contexts/Setup';
import { usePoolsTabs } from '../context';
import { useStatusButtons } from './useStatusButtons';
import { useTranslation } from 'react-i18next';
import { useOverlay } from 'kits/Overlay/Provider';
import type { NewMemberProps } from './types';
import { CallToActionLoader } from 'library/Loader/CallToAction';
import { usePoolPerformance } from 'contexts/Pools/PoolPerformance';

export const NewMember = ({ syncing }: NewMemberProps) => {
  const { t } = useTranslation();
  const { setOnPoolSetup } = useSetup();
  const { setActiveTab } = usePoolsTabs();
  const { openCanvas } = useOverlay().canvas;
  const { getPerformanceFetchedKey } = usePoolPerformance();
  const { disableJoin, disableCreate } = useStatusButtons();

  const joinButtonDisabled =
    disableJoin() || getPerformanceFetchedKey('pool_list').status !== 'synced';

  const createButtonDisabled = disableCreate();

  return (
    <CallToActionWrapper>
      <div className="inner">
        {syncing ? (
          <CallToActionLoader />
        ) : (
          <>
            <section>
              <div className="buttons">
                <div
                  className={`button primary${joinButtonDisabled ? ` disabled` : ``}`}
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
                    {getPerformanceFetchedKey('pool_list').status !==
                    'synced' ? (
                      t('syncingPoolData', { ns: 'library' })
                    ) : (
                      <>
                        {t('pools.joinPool', { ns: 'pages' })}
                        <FontAwesomeIcon icon={faUserGroup} />
                      </>
                    )}
                  </button>
                </div>

                <div className="button secondary">
                  <button onClick={() => setActiveTab(1)}>
                    {t('pools.browsePools', { ns: 'pages' })}
                    <FontAwesomeIcon
                      icon={faChevronRight}
                      transform={'shrink-4'}
                    />
                  </button>
                </div>
              </div>
            </section>
            <section>
              <div className="buttons">
                <div
                  className={`button secondary standalone${createButtonDisabled ? ` disabled` : ``}`}
                >
                  <button
                    onClick={() => setOnPoolSetup(true)}
                    disabled={createButtonDisabled}
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
