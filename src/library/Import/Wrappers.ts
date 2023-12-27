// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

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

  box-sizing: content-box;
  overflow: auto;
  height: auto;
  display: flex;
  flex-direction: column;
  padding: 0rem 0rem 7rem 0rem;

  .items {
    display: flex;
    flex-direction: column;
    padding: 0 1rem;
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

export const QRViewerWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  padding: 2rem 1rem;

  .title {
    color: var(--accent-color-primary);
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
    border-radius: 0.75rem;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    overflow: hidden;

    &.withBorder {
      padding: 0.95rem;
      border: 3.75px solid var(--accent-color-pending);
    }
  }
  .foot {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 1.75rem;
    padding: 0 1rem;
    width: 100%;

    > div {
      display: flex;
      justify-content: center;
      margin-top: 1rem;
      width: 100%;
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
