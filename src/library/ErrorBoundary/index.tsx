// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBug } from '@fortawesome/free-solid-svg-icons';
import i18next from 'i18next';
import { Wrapper } from './Wrapper';

export const ErrorFallbackApp = ({
  resetErrorBoundary,
}: {
  resetErrorBoundary: () => void;
}) => (
  <Wrapper className="app">
    <h3>
      <FontAwesomeIcon icon={faBug} transform="grow-25" />
    </h3>
    {i18next.resolvedLanguage === 'en' ? (
      <h1>Oops, Something Went Wrong</h1>
    ) : (
      <h1>抱歉，页面出现点小问题哦</h1>
    )}
    <h2>
      <button type="button" onClick={resetErrorBoundary}>
        {i18next.resolvedLanguage === 'en' ? 'Click to reload' : '重新下载'}
      </button>
    </h2>
  </Wrapper>
);

export const ErrorFallbackRoutes = ({
  resetErrorBoundary,
}: {
  resetErrorBoundary: () => void;
}) => (
  <Wrapper>
    <h3 className="with-margin">
      <FontAwesomeIcon icon={faBug} transform="grow-25" />
    </h3>
    {i18next.resolvedLanguage === 'en' ? (
      <h1>Oops, Something Went Wrong</h1>
    ) : (
      <h1>抱歉，页面出现点小问题哦</h1>
    )}
    <h2>
      <button type="button" onClick={resetErrorBoundary}>
        {i18next.resolvedLanguage === 'en' ? 'Click to reload' : '重新下载'}
      </button>
    </h2>
  </Wrapper>
);

export const ErrorFallbackModal = ({
  resetErrorBoundary,
}: {
  resetErrorBoundary: () => void;
}) => (
  <Wrapper className="modal">
    {i18next.resolvedLanguage === 'en' ? (
      <h2>Oops, Something Went Wrong</h2>
    ) : (
      <h2>抱歉，页面出现点小问题哦</h2>
    )}
    <h4>
      <button type="button" onClick={resetErrorBoundary}>
        {i18next.resolvedLanguage === 'en' ? 'Click to reload' : '重新下载'}
      </button>
    </h4>
  </Wrapper>
);
