// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import styled from 'styled-components';

export const Wrapper = styled.div<{ isAddress?: boolean }>`
  width: 100%;
  padding: 0.15rem 0.25rem;
  h4 {
    display: flex;
    flex-flow: row wrap;
    align-items: center;
    margin: 0 0 0.2rem 0;

    .help-icon {
      margin-left: 0.55rem;
    }
    > .btn {
      background: var(--button-tertiary-background);
      display: flex;
      flex-flow: row wrap;
      justify-content: center;
      align-items: center;
      border-radius: 2rem;
      width: 1.5rem;
      height: 1.5rem;
      margin-left: 0.65rem;
      transition: color 0.15s;
      &:hover {
        color: var(--network-color-primary);
      }
    }
  }

  .content {
    display: flex;
    flex-flow: column nowrap;
    align-items: center;
    height: 2.4rem;
    position: relative;
    width: auto;
    max-width: 100%;
    overflow: hidden;

    .text {
      padding-left: ${(props) => (props.isAddress ? '3rem' : 0)};
      color: var(--text-color-secondary);
      padding-top: 0.1rem;
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
        display: flex;
        left: 0;
        top: 0;
        flex-flow: row wrap;
        align-items: center;
      }

      > span {
        position: absolute;
        display: flex;
        right: 0.2rem;
        top: 0rem;
      }
    }
  }
`;
