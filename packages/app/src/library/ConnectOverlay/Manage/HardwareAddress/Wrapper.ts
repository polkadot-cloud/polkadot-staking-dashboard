// // Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: AGPL-3.0

import styled from 'styled-components'

export const Wrapper = styled.div`
  display: flex;
  align-items: center;
  padding: 0.5rem 0.5rem 1.5rem 0.55rem;
  position: relative;

  &.last {
    padding-bottom: 0.5rem;
  }

  > .border {
    border-bottom: 1px solid var(--border-primary-color);
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
      color: var(--accent-color-secondary);
      font-family: InterSemiBold, sans-serif;
      font-size: 0.75rem;
      width: 100%;
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

        > .counter {
          background: var(--background-default);
          border: 1.25px solid var(--border-secondary-color);
          color: var(--text-color-secondary);
          font-family: InterBold, sans-serif;
          border-radius: 0.25rem;
          position: absolute;
          bottom: -0.25rem;
          right: -0.4rem;
          min-width: 1.15rem;
          display: flex;
          align-items: center;
          justify-content: center;
          height: 1rem;
          font-size: 0.6rem;

          svg {
            color: var(--text-color-primary);
            width: 60%;
            height: 60%;
          }
        }
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
          background: var(--background-primary);
          border: 1px solid var(--border-primary-color);
          color: var(--text-color-primary);
          font-family: InterSemiBold, sans-serif;
          border-radius: 0.5rem;
          padding: 0.5rem 0.6rem;
          letter-spacing: 0.02rem;
          font-size: 0.75rem;
          text-overflow: ellipsis;
          white-space: nowrap;
          overflow: hidden;
          width: 100%;
          max-width: 275px;
          transition:
            background 0.2s,
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
          margin-top: 0.35rem;
          margin-bottom: 1.1rem;
          opacity: 0.8;
          position: relative;
          width: 100%;

          > span {
            color: var(--text-color-primary);
            font-family: InterSemiBold, sans-serif;
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
            font-size: 0.7rem;

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
