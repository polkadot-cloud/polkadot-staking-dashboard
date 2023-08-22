// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import styled from 'styled-components';
import { SmallFontSizeMaxWidth } from 'consts';

export const Wrapper = styled.div`
  flex-grow: 1;
  display: flex;
  flex-flow: row wrap;
  align-items: center;
  width: 100%;

  @media (min-width: ${SmallFontSizeMaxWidth + 225}px) {
    margin-bottom: 1rem;
  }

  > div {
    border-right: 0;
    flex-basis: 100%;
    flex-grow: 1;
    margin-bottom: 0.5rem;

    &:last-child {
      border-right: 0;
    }

    @media (min-width: ${SmallFontSizeMaxWidth + 225}px) {
      border-right: 1px solid var(--border-primary-color);
      flex-basis: 25%;
      margin-bottom: 0;
      padding-left: 1rem;
      padding-right: 1rem;
      max-width: 275px;

      &:last-child {
        max-width: none;
      }
    }

    > .inner {
      border-bottom: 1px solid var(--border-primary-color);
      display: flex;
      flex-flow: column wrap;
      padding: 0.5rem 0.5rem 1rem 0.5rem;

      @media (min-width: ${SmallFontSizeMaxWidth + 225}px) {
        margin-bottom: 0;
      }

      h2 {
        color: var(--accent-color-primary);
      }

      h4 {
        color: var(--text-color-secondary);
        font-family: InterSemiBold, sans-serif;
        display: flex;
        flex-flow: row wrap;
        align-items: center;
        margin-top: 0.45rem;
      }
    }

    &:first-child {
      padding-left: 0;
    }
    &:last-child {
      padding-right: 0;
    }
  }
`;
