// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import styled from 'styled-components';
import { backgroundLabel, borderPrimary, textSecondary } from 'theme';

export const Wrapper = styled.div<{ activeInput?: boolean }>`
  > .inner {
    width: 100%;
    display: flex;
    flex-flow: column nowrap;
    border-bottom: 1.5px solid
      ${(props) =>
        props.activeInput ? 'var(--network-color-primary)' : borderPrimary};
    padding: 0rem 0 0.4rem 0;
    transition: border 0.15s;

    > h4 {
      color: ${textSecondary};
      margin-bottom: 0.5rem;
    }

    > .account {
      width: 100%;
      display: flex;
      flex-flow: row nowrap;
      align-items: center;
      margin-top: 0.2rem;

      > .emptyIcon {
        width: 2.5rem;
        height: 2.5rem;
        border-radius: 50%;
        background: ${backgroundLabel};
      }

      > .input {
        color: ${textSecondary};
        display: flex;
        flex-flow: column nowrap;
        margin-left: 0.75rem;
        min-width: 150px;
        max-width: 100%;

        > input {
          color: ${textSecondary};
          font-size: 1.25rem;
          z-index: 1;
          font-variation-settings: 'wght' 550;
          opacity: 1;

          &:disabled {
            opacity: 0.75;
          }
        }

        .hidden {
          font-size: 1.25rem;
          opacity: 0;
          position: absolute;
          top: -999px;
          font-variation-settings: 'wght' 550;
        }
      }
    }
  }

  .label {
    position: relative;
    max-width: 100%;
    overflow: hidden;
    height: 2rem;
    margin-top: 0.65rem;

    h5 {
      position: absolute;
      top: 0;
      left: 0;
      color: ${textSecondary};
      max-width: 100%;
      margin: 0;
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
      > svg {
        margin-right: 0.4rem;
      }
    }
  }
`;
