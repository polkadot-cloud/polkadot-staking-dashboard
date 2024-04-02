// Copyright 2024 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { CallToActionWrapper } from 'library/CallToAction';
import {
  faChevronCircleRight,
  faChevronRight,
} from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from 'react-i18next';
import { useSetup } from 'contexts/Setup';
import { useActiveAccounts } from 'contexts/ActiveAccounts';
import { useNavigate } from 'react-router-dom';
import { useApi } from 'contexts/Api';
import type { NewNominatorProps } from '../types';
import { CallToActionLoader } from 'library/Loader/CallToAction';
import { useImportedAccounts } from 'contexts/Connect/ImportedAccounts';

export const NewNominator = ({ syncing }: NewNominatorProps) => {
  const { t } = useTranslation();
  const { isReady } = useApi();
  const navigate = useNavigate();
  const { setOnNominatorSetup } = useSetup();
  const { activeAccount } = useActiveAccounts();
  const { isReadOnlyAccount } = useImportedAccounts();

  const nominateButtonDisabled =
    !isReady || !activeAccount || isReadOnlyAccount(activeAccount);

  return (
    <CallToActionWrapper>
      <div className="inner">
        {syncing ? (
          <CallToActionLoader />
        ) : (
          <section className="standalone">
            <div className="buttons">
              <div
                className={`button primary${nominateButtonDisabled ? ` disabled` : ``}`}
              >
                <button
                  onClick={() => setOnNominatorSetup(true)}
                  disabled={nominateButtonDisabled}
                >
                  {t('nominate.startNominating', { ns: 'pages' })}
                  <FontAwesomeIcon icon={faChevronCircleRight} />
                </button>
              </div>
              <div className="button secondary">
                <button onClick={() => navigate('/validators')}>
                  {t('browseValidators', { ns: 'library' })}
                  <FontAwesomeIcon icon={faChevronRight} transform="shrink-4" />
                </button>
              </div>
            </div>
          </section>
        )}
      </div>
    </CallToActionWrapper>
  );
};
