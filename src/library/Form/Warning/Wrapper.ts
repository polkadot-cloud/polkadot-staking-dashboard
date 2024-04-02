// Copyright 2024 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import styled from 'styled-components';

export const Wrapper = styled.div`
  background: var(--button-primary-background);
  border: 1px solid var(--accent-color-secondary);
  margin: 0.5rem 0;
  padding: 0.6rem 0.9rem;
  border-radius: 0.75rem;
  display: flex;
  flex-flow: row wrap;
  align-items: center;
  width: 100%;

  > h4 {
    color: var(--accent-color-secondary);
    font-family: Inter, sans-serif;

    .icon {
      color: var(--accent-color-secondary);
      margin-right: 0.5rem;
    }
  }
`;
