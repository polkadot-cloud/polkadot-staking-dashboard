// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import styled from 'styled-components';

export const Wrapper = styled.div`
  background: var(--background-invert);
  transition: opacity var(--transition-duration);
  display: flex;
  flex-flow: column wrap;
  border-radius: 0.5rem;
  padding: 0.25rem 0.75rem;
  width: max-content;
  max-width: 200px;

  h3 {
    color: var(--text-color-invert);
    font-family: InterSemiBold, sans-serif;
    font-size: 0.9rem;
    padding: 0;
    text-align: center;
  }
`;
