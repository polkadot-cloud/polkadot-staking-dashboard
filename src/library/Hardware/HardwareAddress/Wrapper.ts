// // Copyright 2024 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import styled from 'styled-components';

export const Wrapper = styled.div`
  border-bottom: 1px solid var(--border-primary-color);
  height: 7rem;
  display: flex;
  align-items: center;
  margin-top: 1rem;
  padding: 1rem 0.5rem;

  > .action {
    height: 100%;
    flex-basis: auto;
    display: flex;
    flex-direction: column;
    padding-left: 1rem;

    > button {
      flex-basis: 50%;
      flex-grow: 1;
      width: 8rem;
    }
  }

  > .content {
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    height: 100%;

    > .inner {
      display: flex;
      align-items: flex-start;

      > .identicon {
        flex-shrink: 1;
        flex-grow: 0;
        position: relative;

        .index-icon {
          background: var(--background-primary);
          border: 1px solid var(--border-primary-color);
          color: var(--text-color-secondary);
          font-family: InterSemiBold, sans-serif;
          border-radius: 50%;
          position: absolute;
          bottom: -0.25rem;
          right: -0.6rem;
          min-width: 1.75rem;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0 0.35rem;
          height: 1.75rem;
          width: auto;

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
          margin-left: 0.5rem;
        }

        section {
          width: 100%;
          display: flex;
          padding-left: 1.5rem;

          &.row {
            align-items: center;

            .edit {
              margin-left: 0.75rem;
            }
          }
        }

        h5,
        button {
          font-size: 0.9rem;

          &.label {
            display: flex;
            align-items: flex-end;
            margin-right: 0.5rem;
            margin-bottom: 0.85rem;
          }
        }

        input {
          background: var(--background-list-item);
          color: var(--text-color-primary);
          border-radius: 0.75rem;
          padding: 0.85rem 0.75rem;
          letter-spacing: 0.04rem;
          font-size: 1rem;
          text-overflow: ellipsis;
          white-space: nowrap;
          overflow: hidden;
          width: 100%;
          max-width: 175px;
          transition:
            background 0.2s,
            max-width 0.2s,
            padding 0.2s;

          &:focus {
            background: var(--background-menu);
            max-width: 300px;
          }

          &:disabled {
            border: 1px solid var(--background-menu);
            background: none;
          }
        }

        .full {
          margin-top: 0.75rem;
          margin-bottom: 0.5rem;
          opacity: 0.8;
          position: relative;
          height: 1rem;
          width: 100%;

          > span {
            position: absolute;
            top: 0;
            left: 0;
            text-overflow: ellipsis;
            white-space: nowrap;
            overflow: hidden;
            padding-left: 1.5rem;
            width: 100%;
            max-width: 100%;
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
`;
