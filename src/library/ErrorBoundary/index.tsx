// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBug } from '@fortawesome/free-solid-svg-icons';
import { Wrapper } from './Wrapper';

export const ErrorFallback = ({
  resetErrorBoundary,
}: {
  resetErrorBoundary: () => void;
}) => (
  <Wrapper>
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
