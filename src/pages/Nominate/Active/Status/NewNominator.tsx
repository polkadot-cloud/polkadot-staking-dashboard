// Copyright 2024 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { CallToActionWrapper } from 'library/CallToAction';
import { faChevronCircleRight } from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from 'react-i18next';
import { useSetup } from 'contexts/Setup';
import { useActiveAccounts } from 'contexts/ActiveAccounts';
import { useNavigate } from 'react-router-dom';
import { useApi } from 'contexts/Api';

export const NewNominator = () => {
  const { t } = useTranslation('pages');
  const navigate = useNavigate();
  const { isReady } = useApi();
  const { activeAccount } = useActiveAccounts();
  const { setOnNominatorSetup } = useSetup();
  // const setupPercent = getNominatorSetupPercent(activeAccount);

  return (
    <CallToActionWrapper>
      <div className="inner">
        <section className="standalone">
          <div className="buttons">
            <div className="button primary">
              <button
                onClick={() => setOnNominatorSetup(true)}
                disabled={!isReady || !activeAccount}
              >
                {t('nominate.startNominating')}
                <FontAwesomeIcon icon={faChevronCircleRight} />
              </button>
            </div>
            <div className="button secondary">
              <button onClick={() => navigate('/validators')}>
                Browse Validators
              </button>
            </div>
          </div>
        </section>
      </div>
    </CallToActionWrapper>
  );
};
