// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { faBug } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useTranslation } from 'react-i18next';
import React from 'react';
import { Wrapper } from './Wrapper';

export const ErrorFallbackApp = ({
  resetErrorBoundary,
}: {
  resetErrorBoundary: () => void;
}) => {
  const { t } = useTranslation('library');

  return (
    <Wrapper className="app">
      <h3>
        <FontAwesomeIcon icon={faBug} transform="grow-25" />
      </h3>
      <h1>{t('errorUnknown')}</h1>
      <h2>
        <button type="button" onClick={resetErrorBoundary}>
          {t('clickToReload')}
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
  const { t } = useTranslation('library');

  return (
    <Wrapper>
      <h3 className="with-margin">
        <FontAwesomeIcon icon={faBug} transform="grow-25" />
      </h3>
      <h1>{t('errorUnknown')}</h1>
      <h2>
        <button type="button" onClick={resetErrorBoundary}>
          {t('clickToReload')}
        </button>
      </h2>
    </Wrapper>
  );
};

interface ErrorFallbackProps {
  resetErrorBoundary?: () => void;
}
export const ErrorFallbackModal: React.FC = (props: ErrorFallbackProps) => {
  const { resetErrorBoundary } = props;
  const { t } = useTranslation('library');

  return (
    <Wrapper className="modal">
      <h2>{t('errorUnknown')}</h2>
      <h4>
        <button
          type="button"
          onClick={() => resetErrorBoundary && resetErrorBoundary()}
        >
          {t('clickToReload')}
        </button>
      </h4>
    </Wrapper>
  );
};
