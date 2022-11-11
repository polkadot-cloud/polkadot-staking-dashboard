// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { faBug } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useTranslation } from 'react-i18next';
import { Wrapper } from './Wrapper';

// an example of types of errors, could be unknown
const error = 403;

export const ErrorFallbackApp = ({
  resetErrorBoundary,
}: {
  resetErrorBoundary: () => void;
}) => {
  const { t } = useTranslation('common');

  return (
    <Wrapper className="app">
      <h3>
        <FontAwesomeIcon icon={faBug} transform="grow-25" />
      </h3>
      <h1>{t([`errors.${error}`, 'library.errors.unknown'])}</h1>
      <h2>
        <button type="button" onClick={resetErrorBoundary}>
          {t('library.click_to_reload')}
        </button>
      </h2>
    </Wrapper>
  );
};

export const ErrorFallbackRoutes = ({
  resetErrorBoundary,
}: {
  resetErrorBoundary: () => void;
}) => {
  const { t } = useTranslation('common');

  return (
    <Wrapper>
      <h3 className="with-margin">
        <FontAwesomeIcon icon={faBug} transform="grow-25" />
      </h3>
      <h1>{t([`errors.${error}`, 'library.errors.unknown'])}</h1>
      <h2>
        <button type="button" onClick={resetErrorBoundary}>
          {t('library.click_to_reload')}
        </button>
      </h2>
    </Wrapper>
  );
};

export const ErrorFallbackModal = ({
  resetErrorBoundary,
}: {
  resetErrorBoundary: () => void;
}) => {
  const { t } = useTranslation('common');

  return (
    <Wrapper className="modal">
      <h2>{t([`errors.${error}`, 'library.errors.unknown'])}</h2>
      <h4>
        <button type="button" onClick={resetErrorBoundary}>
          {t('library.click_to_reload')}
        </button>
      </h4>
    </Wrapper>
  );
};
