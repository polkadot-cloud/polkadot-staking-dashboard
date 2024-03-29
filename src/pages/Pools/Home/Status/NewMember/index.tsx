// Copyright 2024 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { NewMemberWrapper } from './Wrapper';
import { faChevronRight, faUserGroup } from '@fortawesome/free-solid-svg-icons';
import { useSetup } from 'contexts/Setup';
import { usePoolsTabs } from '../../context';
import { useStatusButtons } from '../useStatusButtons';
import { useActiveAccounts } from 'contexts/ActiveAccounts';
import { useTranslation } from 'react-i18next';

export const NewMember = () => {
  const { t } = useTranslation('pages');
  const { setOnPoolSetup } = useSetup();
  const { setActiveTab } = usePoolsTabs();
  const { getPoolSetupPercent } = useSetup();
  const { activeAccount } = useActiveAccounts();
  const { disableJoin, disableCreate } = useStatusButtons();

  const setupPercent = getPoolSetupPercent(activeAccount);

  return (
    <NewMemberWrapper>
      <div className="inner">
        <section>
          <div className="buttons">
            <div className="button primary">
              <button onClick={() => setActiveTab(1)} disabled={disableJoin()}>
                {t('pools.joinPool')}
                <FontAwesomeIcon icon={faUserGroup} />
              </button>
            </div>
            <div className="button secondary">
              <button onClick={() => setActiveTab(1)}>
                {t('pools.browsePools')}
                <FontAwesomeIcon icon={faChevronRight} transform={'shrink-5'} />
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
                {setupPercent !== 0 && ` - In Progress`}
                <FontAwesomeIcon icon={faChevronRight} transform={'shrink-5'} />
              </button>
            </div>
          </div>
        </section>
      </div>
    </NewMemberWrapper>
  );
};
