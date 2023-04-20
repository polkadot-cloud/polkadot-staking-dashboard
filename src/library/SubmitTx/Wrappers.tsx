// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import styled from 'styled-components';

export const Wrapper = styled.div<{ noMargin?: boolean }>`
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-top: ${(props) => (props.noMargin ? '0' : '1rem')};

  .sign {
    opacity: 0.75;
    font-size: 0.9rem;
    margin: 0;
    padding-left: 0.5rem;
    padding-bottom: 0;

    .danger {
      color: var(--status-danger-color);
    }
    > .icon {
      margin-right: 0.3rem;
    }
  }

  > .inner {
    background: var(--background-modal-footer);
    width: 100%;
    padding: 1rem;
    display: flex;
    flex-direction: column;

    > section {
      width: 100%;
      display: flex;
      align-items: center;

      p {
        color: var(--text-color-secondary);
        display: flex;
        align-items: center;
        font-size: 1rem;
        opacity: 0.75;
        margin: 0;
        padding-left: 0.5rem;
        font-variation-settings: 'wght' 575;
      }

      > div {
        display: flex;
        &:first-child {
          flex-direction: column;
          justify-content: center;
          flex-grow: 1;
        }
        &:last-child {
          button {
            margin-left: 0.75rem;
          }
        }
      }
    }
  }
`;
