// Copyright 2023 @paritytech/polkadot-live authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { motion } from 'framer-motion';
import styled from 'styled-components';

export const HeadingWrapper = styled.div`
  position: sticky;
  width: 100%;
  top: 0px;
  padding: 1.25rem 1.25rem 0.5rem 1.25rem;
  display: flex;
  z-index: 3;

  > section {
    flex: 1;

    &:first-child {
      display: flex;
      flex-grow: 1;
      > h4 {
        padding: 0;
        display: flex;
        align-items: center;
        > span {
          color: var(--text-color-primary);
          margin-right: 0.5rem;
          > svg {
            margin: 0 0.7rem 0 0.2rem;
          }
        }
        > svg {
          width: 1.1rem;
          height: 1.1rem;
          margin-right: 0.6rem;
          path {
            fill: var(--text-color-primary);
          }
        }
      }
    }
    &:last-child {
      display: flex;
      justify-content: flex-end;
    }
  }
`;

export const StatusBarWrapper = styled(motion.div)`
  padding: 0 0.5rem 0.5rem 0.5rem;
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  z-index: 10;

  > .inner {
    background: var(--background-list-item);
    border-radius: 1rem;
    display: flex;
    align-items: center;
    padding: 0.7rem 1rem;

    > div {
      display: flex;
      align-items: center;

      &:first-child {
        flex-grow: 1;
        .text {
          flex: 1;
          flex-direction: column;
        }
      }
      &:last-child {
        flex-shrink: 1;
        justify-content: flex-end;
        button {
          margin-left: 0.75rem;
        }
      }
    }

    .icon {
      margin: 0 1rem 0 0.25rem;
      path {
        fill: var(--text-color-primary);
      }
    }
    h3,
    h5 {
      display: flex;
      align-items: center;
      flex: 1;
    }
    h5 {
      margin-top: 0.25rem;
    }
  }
`;

export const AddressesWrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0rem 0rem 7rem 0rem;
  height: auto;
  box-sizing: content-box;
  overflow: auto;

  .items {
    padding: 0 1rem;
    display: flex;
    flex-direction: column;

    .item {
      background: var(--background-default);
      display: flex;
      align-items: center;
      border-radius: 1rem;
      margin-top: 1rem;
      padding: 1rem;

      > .content {
        display: flex;
        flex-direction: column;
        flex-grow: 1;

        .head {
          display: flex;
          margin-bottom: 1.1rem;

          h5 {
            color: var(--text-color-secondary);
            opacity: 0.8;
          }
        }

        > .inner {
          display: flex;
          align-items: center;

          > .identicon {
            flex-shrink: 1;
            flex-grow: 0;
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
              padding-left: 1rem;
              &.row {
                align-items: center;
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
            .addressFull {
              opacity: 0.8;
              margin-top: 1rem;
              margin-bottom: 0.5rem;
              position: relative;
              width: 100%;
              height: 1rem;

              > span {
                position: absolute;
                top: 0;
                left: 0;
                text-overflow: ellipsis;
                white-space: nowrap;
                overflow: hidden;
                width: 100%;
                max-width: 100%;
                padding-left: 1.2rem;
              }
            }
            section {
              width: 100%;
              display: flex;
              padding-left: 1rem;
              &.row {
                align-items: center;
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
            .addressFull {
              opacity: 0.8;
              margin-top: 1rem;
              margin-bottom: 0.5rem;
              position: relative;
              width: 100%;
              height: 1rem;

              > span {
                position: absolute;
                top: 0;
                left: 0;
                text-overflow: ellipsis;
                white-space: nowrap;
                overflow: hidden;
                width: 100%;
                max-width: 100%;
                padding-left: 1.2rem;
              }
            }

            input {
              background: var(--background-menu);
              border-radius: 0.75rem;
              color: var(--text-color-primary);
              padding: 0.75rem 0.75rem;
              letter-spacing: 0.04rem;
              font-size: 1rem;
              transition: background 0.2s, width 0.2s, padding 0.2s;
              text-overflow: ellipsis;
              white-space: nowrap;
              overflow: hidden;
              width: 145px;

              &:focus {
                background: var(--button-secondary-background);
                width: 300px;
              }

              &:disabled {
                border: 1px solid var(--background-menu);
                background: none;
              }
            }
          }
        }
      }
      > .action {
        flex: 0;
      }
    }
  }

  .edit {
    margin-left: 0.75rem;
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
