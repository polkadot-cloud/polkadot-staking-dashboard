// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { faArrowAltCircleUp } from '@fortawesome/free-regular-svg-icons';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { ButtonInvert, ButtonSubmit } from '@rossbulat/polkadot-dashboard-ui';
import { useTranslation } from 'react-i18next';
import { FooterWrapper } from '../../Wrappers';

export const FormFooter = ({
  setSection,
  submitTx,
  submitting,
  isValid,
}: any) => {
  const hasSections = setSection !== undefined;
  const { t } = useTranslation('common');

  const handleSubmit = () => {
    if (hasSections) {
      setSection(0);
    }
  };

  return (
    <FooterWrapper>
      <div>
        {hasSections && (
          <ButtonInvert
            text={t('modals.back')}
            iconLeft={faChevronLeft}
            onClick={() => handleSubmit()}
          />
        )}
      </div>
      <div>
        <ButtonSubmit
          text={`Submit${submitting ? `ting` : ''}`}
          iconLeft={faArrowAltCircleUp}
          iconTransform="grow-2"
          onClick={() => submitTx()}
          disabled={submitting || !isValid}
        />
      </div>
    </FooterWrapper>
  );
};
