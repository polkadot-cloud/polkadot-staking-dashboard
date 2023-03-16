// Copyright 2023 @paritytech/polkadot-live authors & contributors
// SPDX-License-Identifier: Apache-2.0

import styled from 'styled-components';

export const AddressWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  padding: 0rem 0rem 8rem 0rem;
  overflow: scroll;
  height: auto;
  box-sizing: content-box;

  .heading {
    background: var(--background-primary);
    border-bottom: 1px solid var(--border-primary-color);
    position: sticky;
    width: 100%;
    top: 0px;
    padding: 1rem;
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
    margin-top: 1rem;
    padding: 0 1rem;
    display: flex;
    flex-direction: column;

    .item {
      border-bottom: 1px solid var(--border-primary-color);
      display: flex;
      align-items: center;
      padding: 0rem 1rem 1rem 0.25rem;
      margin-bottom: 1.25rem;

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
          }
          .text {
            display: flex;
            flex-direction: column;
            padding-left: 1rem;

            .label {
              margin-right: 0.5rem;
              margin-bottom: 0.5rem;
            }

            h5,
            button {
              font-size: 0.75rem;
              > span {
                padding: 0.3rem 0.5rem;
                border-radius: 0.75rem;
                &.withBg {
                  background: var(--background-menu);
                }
              }

              &.addressFull {
                opacity: 0.8;
                padding-left: 0.5rem;
              }
            }

            input {
              color: var(--color-text-primary);
              letter-spacing: 0.04rem;
              font-size: 0.92rem;
              padding: 0.5rem 0.5rem;
              border-radius: 0.5rem;
              transition: background 0.2s, width 0.2s;
              text-overflow: ellipsis;
              white-space: nowrap;
              overflow: hidden;
              width: 135px;
              background: none;

              &:focus {
                background: var(--background-secondary);
                width: 300px;
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
