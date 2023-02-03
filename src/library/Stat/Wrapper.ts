// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import styled from 'styled-components';
import { buttonHelpBackground, networkColor, textSecondary } from 'theme';

export const Wrapper = styled.div<{ isAddress?: boolean }>`
  width: 100%;
  padding: 0.15rem 0.25rem;
  h4 {
    display: flex;
    flex-flow: row wrap;
    align-items: center;
    justify-content: flex-start;
    margin: 0 0 0.2rem 0;

    .help-icon {
      margin-left: 0.55rem;
    }
    > .btn {
      display: flex;
      flex-flow: row wrap;
      justify-content: center;
      align-items: center;
      background: ${buttonHelpBackground};
      border-radius: 2rem;
      width: 1.5rem;
      height: 1.5rem;
      margin-left: 0.65rem;
      transition: color 0.15s;
      &:hover {
        color: ${networkColor};
      }
    }
  }

  .content {
    display: flex;
    flex-flow: column nowrap;
    align-items: center;
    justify-content: flex-start;
    height: 2.4rem;
    position: relative;
    width: auto;
    max-width: 100%;
    overflow: hidden;

    .text {
      padding-left: ${(props) => (props.isAddress ? '3rem' : 0)};
      padding-top: 0.1rem;
      color: ${textSecondary};
      position: absolute;
      left: 0;
      top: 0;
      margin: 0;
      height: 2.4rem;
      font-size: 1.4rem;
      font-variation-settings: 'wght' 625;
      width: auto;
      max-width: 100%;
      text-align: left;
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;

      .identicon {
        position: absolute;
        left: 0;
        top: 0;
        display: flex;
        flex-flow: row wrap;
        align-items: center;
      }

      > span {
        position: absolute;
        right: 0.2rem;
        top: 0rem;
      }
    }
  }
`;
