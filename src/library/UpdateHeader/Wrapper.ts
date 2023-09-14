// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import styled from 'styled-components';

export const Wrapper = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  margin-bottom: 1rem;

  > span {
    color: var(--text-color-secondary);
    margin: 0 0.75rem;
    opacity: 0.5;
  }

  /* input element of dropdown */
  > div {
    border-bottom: 1px solid var(--border-primary-color);
    display: flex;
    justify-content: center;
    flex: 1;

    > h4 {
      padding: 0.5rem 1rem;
    }
  }
`;
