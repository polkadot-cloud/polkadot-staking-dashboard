// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import styled from 'styled-components';

export const ContentWrapper = styled.div`
  border-radius: 1rem;
  display: flex;
  flex-flow: column nowrap;
  flex-basis: 50%;
  flex: 1;

  .padding {
    padding: 0 1rem;
  }

  > div:last-child {
    margin-bottom: 0;
  }
`;

export const ChunkWrapper = styled.div<any>`
  flex: 1;
  display: flex;
  flex-flow: column wrap;
  margin-top: 1.25rem;

  > div {
    background: var(--button-primary-background);
    display: flex;
    flex-flow: row wrap;
    width: 100%;
    padding: 0.5rem 1rem;
    border-radius: 1rem;

    > section {
      display: flex;
      flex-flow: column wrap;
      justify-content: flex-end;
      padding: 0.75rem 0;

      &:first-child {
        flex-grow: 1;
      }
      &:last-child {
        justify-content: center;
      }
    }
  }

  h2 {
    margin: 0;
  }

  h4 {
    color: var(--text-color-secondary);
    margin: 0.75rem 0 0 0;
  }
`;
