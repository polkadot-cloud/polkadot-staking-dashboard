// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import styled from 'styled-components';
import {
  backgroundLabel,
  borderPrimary,
  networkColor,
  textSecondary,
} from 'theme';

export const TwoThreshold = 800;
const ThreeRowThreshold = 1300;

// The outer container of select items.
// Removes the outer padding for 2 and 3 row layouts.
export const SelectItemsWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-flow: row wrap;

  &.flex {
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
  }
`;

// Button and surrounding padded area.
export const Wrapper = styled.div<{
  selected?: boolean;
  grow: boolean;
  hoverBorder: boolean;
}>`
  padding: 0.6rem;
  width: 100%;

  &.flex {
    width: 33.33%;
    flex-grow: ${(props) => (props.grow ? 1 : 0)};

    /* flex basis for 2-per-row layout */
    @media (min-width: ${TwoThreshold +
      1}px) and (max-width: ${ThreeRowThreshold}px) {
      width: 50%;
    }

    /* flex basis for 3-per-row layout */
    @media (max-width: ${TwoThreshold}px) {
      width: 100%;
    }
  }

  > .inner {
    border: 1.75px solid
      ${(props) => (props.selected ? networkColor : borderPrimary)};
    border-radius: 1rem;
    width: 100%;
    position: relative;
    overflow: hidden;
    transition: border 0.2s;

    &:hover {
      border-color: ${(props) =>
        props.hoverBorder
          ? networkColor
          : props.selected
          ? networkColor
          : borderPrimary};
    }

    > button {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      text-align: left;
      display: flex;
      flex-flow: row wrap;
      align-items: center;

      &:disabled {
        opacity: 0.3;
      }

      > .icon {
        background: ${backgroundLabel};
        color: ${networkColor};
        width: 6rem;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      > .body {
        flex: 1;
        display: flex;
        flex-flow: column wrap;
        justify-content: center;
        padding: 1.25rem 1.35rem;
        overflow: hidden;

        h3 {
          margin: 0;
        }
        p {
          margin: 0.4rem 0 0 0;
        }
      }

      > .toggle {
        color: ${(props) => (props.selected ? networkColor : textSecondary)};
        opacity: ${(props) => (props.selected ? 1 : 0.5)};
        width: 4rem;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }
  }
`;
