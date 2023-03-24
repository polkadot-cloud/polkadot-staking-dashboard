// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import styled from 'styled-components';

export const Wrapper = styled.div`
  background: var(--background-invert);
  display: flex;
  flex-flow: column wrap;
  transition: opacity var(--transition-duration);
  border-radius: 0.5rem;
  padding: 0.25rem 0.5rem;
  min-width: 100px;
  max-width: 200px;

  h3 {
    color: var(--text-color-invert);
    font-size: 0.9rem;
    padding: 0;
    margin: 0;
    text-align: center;
  }
`;
