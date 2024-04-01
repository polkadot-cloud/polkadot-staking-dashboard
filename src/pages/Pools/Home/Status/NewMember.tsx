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
  const { t } = useTranslation('pages');
  const { setOnPoolSetup } = useSetup();
  const { setActiveTab } = usePoolsTabs();
  // const { getPoolSetupPercent } = useSetup();
  const { openCanvas } = useOverlay().canvas;
  // const { activeAccount } = useActiveAccounts();
  const { poolRewardPointsFetched } = usePoolPerformance();
  const { disableJoin, disableCreate } = useStatusButtons();

  // const setupPercent = getPoolSetupPercent(activeAccount);

  return (
    <CallToActionWrapper>
      <div className="inner">
        {syncing ? (
          <CallToActionLoader />
        ) : (
          <>
            <section>
              <div className="buttons">
                <div className="button primary">
                  <button
                    onClick={() =>
                      openCanvas({
                        key: 'JoinPoolCanvas',
                        options: {},
                        size: 'xl',
                      })
                    }
                    disabled={
                      disableJoin() || poolRewardPointsFetched !== 'synced'
                    }
                  >
                    {poolRewardPointsFetched !== 'synced' ? (
                      'Syncing Pool Data...'
                    ) : (
                      <>
                        {t('pools.joinPool')}
                        <FontAwesomeIcon icon={faUserGroup} />
                      </>
                    )}
                  </button>
                </div>

                <div className="button secondary">
                  <button onClick={() => setActiveTab(1)}>
                    {t('pools.browsePools')}
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
                <div className="button secondary standalone">
                  <button
                    onClick={() => setOnPoolSetup(true)}
                    disabled={disableCreate()}
                  >
                    {t('pools.createPool')}
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
