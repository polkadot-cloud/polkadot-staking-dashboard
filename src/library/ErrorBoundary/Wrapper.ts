// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import styled from 'styled-components';
import { textSecondary } from 'theme';

export const Wrapper = styled.div`
  width: 100%;
  display: flex;
  flex-flow: column wrap;
  justify-content: center;
  align-items: center;

  &.app {
    height: 100vh;
  }
  &.modal {
    padding: 0.75rem 0 0 0;
  }

  h1,
  h2 {
    color: ${textSecondary};
  }

  h3 {
    &.with-margin {
      margin-top: 10rem;
    }
    margin-bottom: 3rem;
    svg {
      color: ${textSecondary};
    }
  }

  h4 {
    margin-top: 0;
  }
  button {
    color: ${textSecondary};
    font-size: 1.25rem;

    &:hover {
      opacity: 0.75;
    }
  }
`;
