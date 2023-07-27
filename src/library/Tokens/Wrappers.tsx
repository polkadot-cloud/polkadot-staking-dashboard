// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import styled from 'styled-components';

export const Tokens = styled.div`
  --token-size: 2.25rem;
  --clipped-token-size: 1.75rem;
  background: var(--button-tertiary-background);
  border-radius: 0.75rem;
  display: flex;
  align-items: center;
  margin-right: 1.25rem;
  height: 3.75rem;

  .symbols {
    display: flex;
    flex-direction: row-reverse;
    padding-left: 0.75rem;

    > .token {
      height: var(--token-size);
      width: var(--clipped-token-size);
      position: relative;

      .preload {
        background-color: var(--background-primary);
        height: var(--token-size);
        width: var(--token-size);
        border-radius: 50%;
      }

      svg {
        width: var(--token-size);
        height: var(--token-size);

        .light-fill {
          fill: var(--background-primary);
        }
        .dark-fill {
          fill: var(--text-color-primary);
        }
        .light-stroke {
          stroke: var(--background-primary);
        }
        .dark-stroke {
          stroke: var(--text-color-primary);
        }
      }
    }
  }

  .text {
    > h3 {
      color: var(--text-color-secondary);
      font-family: InterBold, sans-serif;
      font-size: 1.05rem;
      margin: 0 1.25rem;

      &.empty {
        margin-right: 0;
      }

      &.noSymbols {
        margin-left: 0.5rem;
      }
    }
  }
`;
