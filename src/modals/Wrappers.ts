// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import styled from 'styled-components';

// Modal content wrapper
export const ContentWrapper = styled.div`
  background: var(--background-modal);
  width: 100%;
  height: auto;
  overflow: hidden;
  position: relative;

  h2 {
    margin: 1rem 0;

    &.unbounded {
      font-family: 'Unbounded';
    }
    &.title {
      font-size: 1.35rem;
      margin: 1.25rem 0 0 0;
    }
  }

  a {
    color: var(--network-color-primary);
  }
  .header {
    width: 100%;
    display: flex;
    flex-flow: row wrap;
    align-items: center;
    padding: 1rem 1rem 0 1rem;
  }
  .body {
    padding: 1rem;
  }
  .notes {
    padding: 1rem 0;
    > p {
      color: var(--text-color-secondary);
    }
  }
`;
