// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import styled from 'styled-components';
import {
  backgroundLabel,
  borderPrimary,
  networkColor,
  textSecondary,
} from 'theme';

const TwoThreshold = 800;
const ThreeRowThreshold = 1300;

// The outer container of select items.
// Removes the outer padding for 2 and 3 row layouts.
export const SelectItemsWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-wrap: wrap;

  /* Remove outer padding for 2-per-row layout */
  @media (min-width: ${TwoThreshold +
    1}px) and (max-width: ${ThreeRowThreshold}px) {
    > div:nth-child(2n) {
      padding-right: 0;
    }
    > div:nth-child(2n + 1) {
      padding-left: 0;
    }
  }

  /* Remove outer padding for 3-per-row layout */
  @media (min-width: ${ThreeRowThreshold + 1}px) {
    > div:nth-child(3n) {
      padding-right: 0;
    }
    > div:nth-child(3n + 1) {
      padding-left: 0;
    }
  }
`;

// Button and surrounding padded area.
export const Wrapper = styled.div<{ selected?: boolean }>`
  --select-item-height: 7rem;
  padding: 0.5rem;
  flex-basis: 33%;
  flex: 1;

  /* flex basis for 2-per-row layout */
  @media (min-width: ${TwoThreshold +
    1}px) and (max-width: ${ThreeRowThreshold}px) {
    flex-basis: 50%;
  }

  /* flex basis for 3-per-row layout */
  @media (max-width: ${TwoThreshold}px) {
    flex-basis: 100%;
  }

  > button {
    border: 1.75px solid
      ${(props) => (props.selected ? networkColor : borderPrimary)};
    width: 100%;
    text-align: left;
    border-radius: 1rem;
    display: flex;
    flex-flow: row wrap;
    padding: 0;
    overflow: hidden;
    transition: all 0.15s;

    > .icon {
      background: ${backgroundLabel};
      color: ${networkColor};
      width: 6rem;
      height: var(--select-item-height);
      display: flex;
      align-items: center;
      justify-content: center;
    }

    > .body {
      height: var(--select-item-height);
      max-height: var(--select-item-height);
      flex: 1;
      display: flex;
      flex-flow: column wrap;
      justify-content: center;
      padding: 0 1.25rem;
      overflow: hidden;

      h3 {
        margin: 0;
      }
      p {
        margin: 0.5rem 0 0 0;
      }
    }

    > .toggle {
      color: ${(props) => (props.selected ? networkColor : textSecondary)};
      opacity: ${(props) => (props.selected ? 1 : 0.5)};
      height: var(--select-item-height);
      width: 4rem;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
`;
