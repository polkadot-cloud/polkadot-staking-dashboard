// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { ButtonOption, ModalPadding } from '@polkadotcloud/core-ui';
import { useModal } from 'contexts/Modal';
import { Title } from 'library/Modal/Title';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

export const StartStaking = () => {
  const { t } = useTranslation('modals');
  const navigate = useNavigate();
  const { setStatus } = useModal();

  return (
    <>
      <Title title={t('startStaking')} />
      <ModalPadding>
        <ButtonOption
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
        </ButtonOption>
        <ButtonOption
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
        </ButtonOption>
      </ModalPadding>
    </>
  );
};
