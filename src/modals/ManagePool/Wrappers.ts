// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import styled from 'styled-components';

export const ContentWrapper = styled.div`
  border-radius: 1rem;
  display: flex;
  flex-flow: column nowrap;
  flex-basis: 50%;
  min-width: 50%;
  height: auto;
  flex-grow: 1;

  .padding {
    padding: 0 1rem 1rem 1rem;

    h2 {
      margin-bottom: 1rem;
    }

    input {
      margin-top: 0.5rem;
    }
  }

  .items {
    position: relative;
    padding: 0.5rem 0 0rem 0;
    border-bottom: none;
    width: auto;
    border-radius: 0.75rem;
    overflow: hidden;
    overflow-y: auto;
    z-index: 1;
    width: 100%;

    h4 {
      margin: 0.2rem 0;
    }

    .arrow {
      color: var(--text-color-primary);
    }
  }
`;

export const CommissionWrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0 0.5rem 0 0.5rem;

  > h5 {
    margin: 1rem 0 0.5rem 0;

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

  .changeRate {
    display: flex;
    flex-wrap: wrap;
    margin: 0.25rem 0;

    > section {
      color: var(--text-color-secondary);
      flex: 0 1 auto;
      display: flex;
      align-items: center;
      margin: 0.5rem 1rem 0 0;
      border: 1px solid var(--border-primary-color);
      border-radius: 0.75rem;
      padding-right: 0.75rem;

      &:first-child {
        margin-left: 0;
      }
      &:last-child {
        margin-right: 0;
      }

      input {
        width: 40px;
        margin: 0 0.6rem 0 0;
        padding-left: 1rem;
      }
    }
  }

  > div {
    display: flex;
    align-items: center;

    > .current {
      width: 3rem;
    }

    > .slider {
      padding: 0 0.25rem 0 1.25rem;
      flex-grow: 1;

      .rc-slider-handle-dragging {
        box-shadow: 0 0 0 5px var(--network-color-transparent) !important;
      }
    }
  }
`;
