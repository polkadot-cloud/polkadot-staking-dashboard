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

    > .btn {
      color: var(--text-color-secondary);
      background: var(--background-primary);
      display: flex;
      flex-flow: row wrap;
      justify-content: center;
      align-items: center;
      border-radius: 2rem;
      width: 1.5rem;
      height: 1.5rem;
      margin-left: 0.65rem;
      transition: color var(--transition-duration);
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
      font-family: 'SF-Pro-SB', sans-serif;
      color: var(--text-color-primary);
      padding-top: 0.1rem;
      position: absolute;
      left: 0;
      top: 0;
      margin: 0;
      height: 2.4rem;
      font-size: 1.4rem;
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
