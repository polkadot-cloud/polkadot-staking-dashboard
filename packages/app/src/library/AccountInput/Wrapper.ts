// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import styled from 'styled-components';

export const AccountInputWrapper = styled.div`
  position: relative;
  width: 100%;
  margin-top: 0.5rem;

  &.inactive {
    opacity: 0.5;
  }

  .inactive-block {
    position: absolute;
    z-index: 2;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }

  &.border {
    > .input {
      border: 1px solid var(--border-primary-color);
    }
  }

  .input {
    border: 1px solid transparent;
    border-radius: 1rem;
    display: flex;
    flex-flow: row wrap;
    align-items: center;
    padding: 0.5rem 0.5rem 0.5rem 1rem;

    &.disabled {
      background: var(--background-default);
    }
    > section {
      display: flex;
      flex-flow: row wrap;
      align-items: center;

      > div {
        &:first-child {
          padding-right: 0.5rem;

          .ph {
            background: var(--background-default);
            width: 22px;
            height: 22px;
            border-radius: 50%;
          }
        }

        &:last-child {
          display: flex;
          flex-flow: column wrap;
          flex-grow: 1;

          > input {
            font-family: InterSemiBold, sans-serif;
            width: 100%;
            border: none;
            margin: 0;
            padding-right: 1rem;

            &:disabled {
              opacity: 0.75;
            }
          }
        }
      }

      &:first-child {
        flex: 1;
      }
    }
  }
  h5 {
    margin: 0.75rem 0.25rem;
    &.neutral {
      color: var(--text-color-primary);
      opacity: 0.8;
    }
    &.danger {
      color: var(--status-danger-color);
    }
    &.success {
      color: var(--status-success-color);
    }
  }
`;
