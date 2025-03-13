// // Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import styled from 'styled-components'

export const Wrapper = styled.div`
  display: flex;
  align-items: center;
  padding: 1rem 0.5rem 1rem 0.75rem;
  position: relative;
  border-bottom: 1px solid var(--border-primary-color);

  &.last {
    padding-bottom: 0.5rem;
  }

  > .border {
    position: absolute;
    right: 0.5rem;
    bottom: 1rem;
    width: calc(100% - 4rem);

    &.last {
      border-bottom: none;
      padding-bottom: 0;
    }
  }

  > .action {
    flex: 0;
    display: flex;
    flex-direction: column;
    padding-left: 1.5rem;
    padding-right: 0.25rem;

    > button {
      width: 100%;
      margin-right: 0.75rem;
    }
  }

  > .content {
    display: flex;
    flex-direction: column;
    flex-grow: 1;

    > .inner {
      display: flex;
      align-items: center;

      > .identicon {
        position: relative;
      }

      > div:last-child {
        display: flex;
        flex-direction: column;
        justify-content: flex-end;
        flex-grow: 1;

        button {
          color: var(--accent-color-primary);
          margin-left: 0.2rem;
        }

        section {
          display: flex;
          padding-left: 0.9rem;
          width: 100%;

          &.row {
            align-items: center;

            .edit {
              margin-left: 0.4rem;
            }
          }
        }

        h5,
        button {
          &.label {
            display: flex;
            align-items: flex-end;
            margin-right: 0.5rem;
            margin-bottom: 0.85rem;
          }
        }

        input {
          background: var(--button-popover-tab-background);
          border: 1px solid var(--border-primary-color);
          color: var(--text-color-primary);
          font-family: InterSemiBold, sans-serif;
          border-radius: 0.5rem;
          padding: 0.75rem 0.75rem;
          letter-spacing: 0.02rem;
          text-overflow: ellipsis;
          white-space: nowrap;
          overflow: hidden;
          width: 100%;
          max-width: 275px;
          transition:
            background-color 0.2s,
            border-color 0.3s,
            max-width 0.3s,
            padding 0.2s;

          &:focus {
            border-color: var(--accent-color-primary);
          }

          &:disabled {
            background: none;
          }
        }

        .full {
          margin-top: 0.4rem;
          margin-bottom: 1.75rem;
          opacity: 0.8;
          position: relative;
          width: 100%;

          > span {
            color: var(--text-color-secondary);
            position: absolute;
            top: 0;
            left: 0;
            text-overflow: ellipsis;
            white-space: nowrap;
            overflow: hidden;
            padding-left: 1.2rem;
            padding-right: 0;
            width: 100%;
            max-width: 100%;

            > button {
              color: var(--text-color-tertiary);
              margin-left: 0.25rem;
            }
          }
        }
      }
    }
  }

  .more {
    margin-top: 1rem;
    padding: 0 1.5rem;

    h4 {
      opacity: var(--opacity-disabled);
      padding: 0;
    }
  }
`
