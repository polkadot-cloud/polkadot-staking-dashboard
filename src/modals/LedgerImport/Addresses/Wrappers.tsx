// Copyright 2023 @paritytech/polkadot-live authors & contributors
// SPDX-License-Identifier: Apache-2.0

import styled from 'styled-components';

export const AddressWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  padding: 0rem 0rem 7rem 0rem;
  height: auto;
  box-sizing: content-box;
  overflow: auto;

  .heading {
    border-bottom: 1px solid var(--border-primary-color);
    position: sticky;
    width: 100%;
    top: 0px;
    padding: 0.75rem 1.25rem;
    z-index: 3;
    > h4 {
      margin: 0;
      padding: 0;
      display: flex;
      align-items: center;
      > span {
        color: var(--text-color-primary);
        margin-right: 0.5rem;
      }
      svg {
        width: 1.1rem;
        height: 1.1rem;
        margin-right: 0.6rem;
        path {
          fill: var(--text-color-primary);
        }
      }
    }
    h5 {
      color: var(--text-color-secondary);
      margin-top: 0.6rem;
      svg {
        margin: 0 0.4rem 0 0.25rem;
      }
    }
  }

  .items {
    width: 100%;
    padding: 0 1rem;
    display: flex;
    flex-direction: column;

    .item {
      display: flex;
      align-items: center;
      padding: 0rem 1rem 1rem 0.25rem;
      border-bottom: 1px solid var(--border-primary-color);

      &:last-child {
        border: none;
      }

      > div {
        flex: 1;
        display: flex;
        align-items: center;
        &:first-child {
          section {
            display: flex;
            &.row {
              align-items: center;
            }
            .icon {
              color: var(--text-color-primary);
            }
          }
          .text {
            display: flex;
            flex-direction: column;
            padding-left: 1rem;

            .label {
              margin-right: 0.5rem;
              margin-bottom: 0.85rem;
            }

            h5,
            button {
              font-size: 0.9rem;
              > span {
                padding: 0.4rem 0.75rem;
                border-radius: 1rem;
                &.withBg {
                  background: var(--background-list-item);
                }
              }

              &.addressFull {
                opacity: 0.8;
                padding-left: 0.5rem;
                margin-top: 0.85rem;
                margin-bottom: 0.5rem;
              }
            }

            input {
              background: var(--background-list-item);
              color: var(--text-color-primary);
              border-radius: 0.75rem;
              padding: 0.75rem 0.75rem;
              letter-spacing: 0.04rem;
              font-size: 1rem;
              transition: background 0.2s, width 0.2s;
              text-overflow: ellipsis;
              white-space: nowrap;
              overflow: hidden;
              width: 135px;
              margin-left: 0.5rem;

              &:focus {
                background: var(--background-menu);
                width: 300px;
              }

              &:disabled {
                background: none;
              }
            }
          }
        }
        &:last-child {
          justify-content: flex-end;
          button {
            margin-left: 0.5rem;
          }
        }
      }
    }
  }

  .edit {
    margin-left: 0.75rem;
  }

  .more {
    padding: 0 1.5rem;
    h4 {
      margin: 0;
      padding: 0;
      opacity: var(--opacity-disabled);
    }
  }
`;

export const ConfirmWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1.5rem 2.5rem;

  h3,
  h5,
  p {
    text-align: center;
  }
  h3 {
    margin: 1.25rem 0 0.5rem 0;
  }
  h5 {
    margin: 0.25rem 0;
  }
  .footer {
    display: flex;
    margin-top: 1rem;

    > button {
      margin-right: 1rem;
      &:last-child {
        margin-right: 0;
      }
    }
  }
`;
