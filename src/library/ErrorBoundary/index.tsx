// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { faBug } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
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
    <h1>Opps, Something Went Wrong</h1>
    <h2>
      <button type="button" onClick={resetErrorBoundary}>
        Click to reload
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
    <h1>Opps, Something Went Wrong</h1>
    <h2>
      <button type="button" onClick={resetErrorBoundary}>
        Click to reload
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
    <h2>Opps, Something Went Wrong</h2>
    <h4>
      <button type="button" onClick={resetErrorBoundary}>
        Click to reload modal
      </button>
    </h4>
  </Wrapper>
);
