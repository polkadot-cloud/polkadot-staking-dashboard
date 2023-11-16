// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import styled from 'styled-components';

export const AccountWrapper = styled.div`
  transition: transform var(--transition-duration);
  margin: 0.6rem 0 0 0;
  width: 100%;

  &.active {
    > div {
      border: 1px solid var(--accent-color-primary);
    }
  }

  &:hover {
    transform: scale(1.01);
  }

  > div {
    background: var(--button-primary-background);
    color: var(--text-color-primary);
    font-family: InterSemiBold, sans-serif;
    border: 1px solid transparent;
    display: flex;
    align-items: flex-start;
    flex-direction: column;
    border-radius: 0.85rem;
    width: 100%;
    overflow: hidden;

    &.noBorder {
      border: none;
    }

    > section {
      display: flex;
      flex-direction: row;
      align-items: center;
      width: 100%;

      /* Top half of the button, account information */
      &.head {
        background: var(--button-tertiary-background);

        > button {
          color: var(--text-color-primary);
          display: flex;
          align-items: center;
          justify-content: flex-start;
          flex-shrink: 1;
          padding: 0.5rem 0.75rem;
          font-size: 1.05rem;
          width: 100%;
          transition: background var(--transition-duration);

          &:hover {
            .name {
              color: var(--accent-color-primary);
            }
          }

          .label {
            font-size: 0.95rem;
            display: flex;
            align-items: flex-end;
          }

          overflow: hidden;
          .name {
            transition: color var(--transition-duration);
            font-family: InterSemiBold, sans-serif;
            max-width: 100%;
            margin: 0 0.5rem;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;

            > span {
              opacity: 0.7;
              margin-right: 0.6rem;
              > svg {
                margin-left: 0.5rem;
              }
            }
          }

          .badge {
            background-color: var(--background-floating-card);
            color: var(--text-color-secondary);
            margin-left: 1rem;
            padding: 0.25rem 0.5rem;
            border-radius: 0.45rem;
            font-size: 0.9rem;
          }
          .delegator {
            width: 1.1rem;
            z-index: 0;

            > div {
              width: 2rem;
              height: 2rem;
              top: 0.25rem;
            }
          }
          .identicon {
            z-index: 1;
          }

          /* svg theming */
          svg {
            .light {
              fill: var(--text-color-invert);
            }
            .dark {
              fill: var(--text-color-secondary);
            }
          }

          > div:last-child {
            display: flex;
            flex-grow: 1;
            justify-content: flex-end;

            &.neutral {
              h5 {
                color: var(--text-color-secondary);
                opacity: 0.75;
              }
            }
            &.danger {
              h5 {
                color: var(--status-danger-color);
              }
            }
            .icon {
              width: 1.25rem;
              height: 1.25rem;
              margin-left: 0.75rem;

              svg {
                width: inherit;
                height: inherit;
              }
            }
          }
        }
      }

      /* Bottom half of the button, account metadata */
      &.foot {
        border-top: 1px solid var(--border-primary-color);
        padding: 0.7rem 1rem;

        > .balance {
          color: var(--text-color-secondary);
          font-size: 0.9rem;
          opacity: 0.6;
        }
      }
    }
  }
`;

export const AccountSeparator = styled.div`
  width: 100%;
  height: 0.5rem;
`;
