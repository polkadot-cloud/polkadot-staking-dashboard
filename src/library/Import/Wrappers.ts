// Copyright 2023 @paritytech/polkadot-live authors & contributors
// SPDX-License-Identifier: Apache-2.0

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
        font-family: InterSemiBold, sans-serif;
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

export const AddressesWrapper = styled.div`
  --address-item-height: 7rem;

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
      height: var(--address-item-height);
      border-bottom: 1px solid var(--border-primary-color);
      display: flex;
      align-items: center;
      margin-top: 1rem;
      padding: 1rem 0.5rem;

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

            .indexIcon {
              background: var(--background-primary);
              border: 1px solid var(--border-primary-color);
              color: var(--text-color-secondary);
              border-radius: 50%;
              position: absolute;
              bottom: -0.25rem;
              right: -0.6rem;
              width: auto;
              height: 1.75rem;
              min-width: 1.75rem;
              display: flex;
              align-items: center;
              justify-content: center;
              padding: 0 0.35rem;
              font-family: InterSemiBold, sans-serif;

              svg {
                width: 60%;
                height: 60%;
                color: var(--text-color-primary);
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
              transition: background 0.2s, max-width 0.2s, padding 0.2s;

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
              opacity: 0.8;
              margin-top: 0.75rem;
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
                padding-left: 1.5rem;
              }
            }
          }
        }
      }
      > .action {
        height: 100%;
        flex-basis: auto;
        display: flex;
        flex-direction: column;

        button {
          background: var(--background-list-item);
          width: 8rem;
          flex-basis: 100%;
          flex-grow: 1;
          border: none;
        }
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

export const QRVieweraWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  padding: 2rem 1rem;

  .title {
    color: var(--network-color-primary);
    font-family: 'Unbounded';
    margin-bottom: 1rem;
  }

  .progress {
    margin-bottom: 1rem;
    border-radius: 1rem;
    background: var(--background-menu);
    padding: 0.45rem 1.5rem 0.75rem 1.5rem;

    span {
      opacity: 0.4;
      &.active {
        opacity: 1;
      }
    }
    .arrow {
      margin: 0 0.85rem;
    }
  }

  .viewer {
    border-radius: 1.25rem;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    overflow: hidden;

    &.withBorder {
      padding: 0.95rem;
      border: 3.75px solid var(--network-color-pending);
    }
  }
  .foot {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 1.75rem;
    padding: 0 1rem;
    width: 100%;

    .address {
      display: flex;
      margin-top: 0.5rem;
      margin-bottom: 1.25rem;

      svg {
        margin-right: 0.6rem;
      }
    }
    > div {
      display: flex;
      width: 100%;
      justify-content: center;
    }
  }
`;

export const NoAccountsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem 0 3rem 0;

  .icon {
    width: 6rem;
    height: 6rem;
    margin-bottom: 1rem;
  }

  h3 {
    margin-bottom: 1rem;
  }
`;
