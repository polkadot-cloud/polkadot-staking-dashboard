// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import styled from 'styled-components';

export const AccountWrapper = styled.div`
  width: 100%;
  margin: 0.5rem 0 0 0;
  transition: transform var(--transition-duration);

  &.active {
    > div,
    button {
      border: 1px solid var(--network-color-primary);
    }
  }

  &:hover {
    transform: scale(1.006);
    .name {
      color: var(--network-color-primary);
    }
  }

  > div,
  button {
    background: var(--button-primary-background);
    border: 1px solid var(--transparent-color);
    color: var(--text-color-primary);
    font-family: 'SF-Pro-SB', sans-serif;
    width: 100%;
    border-radius: 0.75rem;
    font-size: 1rem;
    display: flex;
    align-items: center;
    min-height: 3.5rem;
    padding-left: 0.4rem;
    padding-right: 0.4rem;

    > div {
      display: flex;
      align-items: center;
      padding: 0 0.25rem;

      &.label {
        font-size: 0.85rem;
        display: flex;
        align-items: flex-end;
      }

      &:first-child {
        flex-shrink: 1;
        overflow: hidden;
        .name {
          max-width: 100%;
          text-overflow: ellipsis;
          white-space: nowrap;
          overflow: hidden;
          transition: color var(--transition-duration);
          margin: 0 0.5rem;
          color: #fff;

          > span {
            opacity: 0.7;
            margin-right: 0.6rem;
            > svg {
              margin-left: 0.5rem;
            }
          }
        }
      }

      &:last-child {
        flex-grow: 1;
        justify-content: flex-end;
      }

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
        width: 1.1rem;
        height: 1.1rem;
        margin-left: 0.75rem;
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
        width: 0.85rem;
        z-index: 0;
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
    }
  }
`;

export const AccountSeparator = styled.div`
  width: 100%;
  height: 0.5rem;
`;

export const AccountGroupWrapper = styled.div`
  border-left: 1px solid var(--border-primary-color);
  width: 100%;
  display: flex;
  flex-direction: column;
  padding-left: 1rem;
  margin: 0.5rem 0 1.25rem 0;

  > div {
    &:first-child {
      margin-top: 0;
    }
    &:last-child {
      margin-bottom: 0;
    }
  }
`;
