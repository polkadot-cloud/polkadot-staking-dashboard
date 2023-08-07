// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import styled from 'styled-components';

export const ContentWrapper = styled.div`
  width: 100%;

  > h4 {
    color: var(--text-color-secondary);
    border-bottom: 1px solid var(--border-primary-color);
    margin: 0.75rem 0;
    padding-bottom: 0.5rem;
    width: 100%;
  }

  .items {
    position: relative;
    border-bottom: none;
    width: auto;
    border-radius: 0.75rem;
    overflow: hidden;
    overflow-y: auto;
    z-index: 1;
    width: 100%;
    margin: 1rem 0 1.5rem 0;

    h4 {
      margin: 0.2rem 0;
    }
    h2 {
      margin: 0.75rem 0;
    }
  }
`;
