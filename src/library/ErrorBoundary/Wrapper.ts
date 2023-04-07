// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import styled from 'styled-components';

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
    color: var(--text-color-secondary);
  }

  h2 {
    margin: 1rem 0;
  }

  h3 {
    margin: 1rem 0;
    &.with-margin {
      margin-top: 10rem;
    }
    margin-bottom: 3rem;
    svg {
      color: var(--text-color-secondary);
    }
  }

  h4 {
    margin-top: 0;
  }
  button {
    color: var(--text-color-secondary);
    font-size: 1.25rem;

    &:hover {
      opacity: 0.75;
    }
  }
`;
