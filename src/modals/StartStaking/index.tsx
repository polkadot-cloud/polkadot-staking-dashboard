// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { faChevronRight, faCog } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useModal } from 'contexts/Modal';
import { Title } from 'library/Modal/Title';
import { PaddingWrapper } from 'modals/Wrappers';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

export const StartStaking = () => {
  const navigate = useNavigate();
  const { setStatus } = useModal();
  const { t } = useTranslation('modals');
  return (
    <>
      <Title title={t('startStaking')} icon={faCog} />
      <PaddingWrapper>
        <button
          type="button"
          className="action-button"
          disabled={false}
          onClick={() => {
            navigate('/nominate');
            setStatus(2);
          }}
        >
          <div>
            <h3>{t('becomeNominator')}</h3>
            <p>{t('becomeNominatorSubtitle')}</p>
          </div>
          <div>
            <FontAwesomeIcon transform="shrink-2" icon={faChevronRight} />
          </div>
        </button>
        <button
          type="button"
          className="action-button"
          disabled={false}
          onClick={() => {
            navigate('/pools?t=2');
            setStatus(2);
          }}
        >
          <div>
            <h3>{t('joinNominationPool')}</h3>
            <p>{t('joinNominationPoolSubtitle')}</p>
          </div>
          <div>
            <FontAwesomeIcon transform="shrink-2" icon={faChevronRight} />
          </div>
        </button>
      </PaddingWrapper>
    </>
  );
};
