// Copyright 2024 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import styled from 'styled-components';

export const CallToActionWrapper = styled.div`
  height: inherit;
  width: 100%;

  > .inner {
    flex: 1;
    display: flex;
    flex-direction: row;
    margin-top: 0.38rem;

    > section {
      display: flex;
      flex-direction: row;
      height: inherit;

      &:nth-child(1) {
        flex-grow: 1;
        border-right: 1px solid var(--border-primary-color);
        padding-right: 1rem;
      }

      &:nth-child(2) {
        flex: 1%;
        padding-left: 1rem;
      }

      &.standalone {
        border: none;
        padding: 0;
      }

      h3 {
        line-height: 1.4rem;
      }

      .buttons {
        --button-border-radius: 2rem;
        background: var(--button-primary-background);
        border-radius: var(--button-border-radius);
        min-height: 3.75rem;
        width: 100%;
        height: 3.75rem;
        display: flex;
        flex-wrap: nowrap;

        > .button {
          height: inherit;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          white-space: nowrap;
          overflow: hidden;

          &.primary {
            background: var(--accent-color-primary);
            border-top-left-radius: var(--button-border-radius);
            border-bottom-left-radius: var(--button-border-radius);
            color: white;
            flex-grow: 1;
          }

          &.secondary {
            color: var(--text-color-primary);
            background: var(--button-primary-background);
            border-top-right-radius: var(--button-border-radius);
            border-bottom-right-radius: var(--button-border-radius);
            height: inherit;
          }

          &.standalone {
            border-radius: var(--button-border-radius);
            flex-grow: 1;
          }

          > button {
            color: inherit;
            height: inherit;
            transition: transform 0.25s;
            padding: 0 2rem;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-wrap: nowrap;
            width: 100%;

            > svg {
              margin: 0 0.75rem;
            }
          }

          &:hover {
            > button {
              transform: scale(1.02);
            }
          }
        }
      }
    }
  }
`;
