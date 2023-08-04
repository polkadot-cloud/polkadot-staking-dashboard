// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import styled from 'styled-components';

export const TokensWrapper = styled.div`
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
  }

  .text {
    > h3 {
      color: var(--text-color-secondary);
      font-family: InterBold, sans-serif;
      font-size: 1.05rem;
      margin: 0 1.25rem 0 1rem;
      padding-right: 1rem;

      &.empty {
        margin-right: 0;
      }

      &.noSymbols {
        margin-left: 0.5rem;
      }

      span {
        border: 1px solid var(--border-secondary-color);
        color: var(--text-color-secondary);
        font-family: InterSemiBold, sans-serif;
        border-radius: 1.25rem;
        margin-left: 0.7rem;
        padding: 0.38rem 0.75rem;
        opacity: 0.8;
        font-size: 0.9rem;
      }
    }
  }
`;

export const TokenWrapper = styled.div`
  --token-size: 2.25rem;
  height: var(--token-size);
  width: var(--clipped-token-size);
  position: relative;

  .preload {
    background-color: var(--background-primary);
    height: var(--token-size);
    width: var(--token-size);
    border-radius: 50%;
  }
`;

export const TokenSvgWrapper = styled.span`
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
`;
