// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { faArrowAltCircleUp } from '@fortawesome/free-regular-svg-icons';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
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
          <button
            type="button"
            className="submit"
            onClick={() => handleSubmit()}
          >
            <FontAwesomeIcon transform="shrink-2" icon={faChevronLeft} />
            {t('modals.back')}
          </button>
        )}
      </div>
      <div>
        <button
          type="button"
          className="submit"
          onClick={() => submitTx()}
          disabled={submitting || !isValid}
        >
          <FontAwesomeIcon
            transform="grow-2"
            icon={faArrowAltCircleUp as IconProp}
          />
          {t('modals.submit')}
          {submitting && t('modals.ting')}
        </button>
      </div>
    </FooterWrapper>
  );
};
