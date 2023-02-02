// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import styled from 'styled-components';
import {
  buttonSecondaryBackground,
  networkColor,
  networkColorSecondary,
  textSecondary,
} from 'theme';

export const BarChartWrapper = styled.div<{ lessPadding?: boolean }>`
  width: 100%;
  padding: ${(props) => (props.lessPadding ? '0 0.5rem' : '0 1.75rem')};
  margin-top: 1rem;

  .available {
    width: 100%;
    display: flex;
    margin-top: 2.7rem;
    > div {
      display: flex;
      flex-flow: row wrap;
      padding: 0 0.35rem;
      &:first-child {
        padding-left: 0;
      }
      &:last-child {
        padding-right: 0;
      }
    }
  }
  .d1 {
    color: white;
    background: ${networkColor};
  }
  .d2 {
    color: white;
    background: ${networkColorSecondary};
  }
  .d3 {
    color: white;
    background: ${textSecondary};
  }
  .d4 {
    color: ${textSecondary};
    background: ${buttonSecondaryBackground};
  }
`;

export const Legend = styled.div`
  width: 100%;
  margin-bottom: 0.4rem;
  display: flex;
  justify-content: flex-start;

  > h4 {
    display: flex;
    align-items: center;
    padding: 0.5rem 1rem;
    font-variation-settings: 'wght' 600;
    font-size: 1.1rem;
    margin-bottom: 0;

    &:first-child {
      padding-left: 0;
    }
    > span {
      width: 1rem;
      height: 1rem;
      margin-right: 0.5rem;
      border-radius: 0.25rem;
    }
  }
`;

export const Bar = styled.div`
  background: ${buttonSecondaryBackground};
  display: flex;
  width: 100%;
  height: 3.3rem;
  border-radius: 0.55rem;
  overflow: hidden;

  > div {
    position: relative;
    height: 100%;
    display: flex;
    align-items: center;
    transition: width 1.5s cubic-bezier(0, 1, 0, 1);

    > span {
      position: absolute;
      left: 0;
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
      font-variation-settings: 'wght' 600;
      padding: 0 0.8rem;
      width: 100%;
      font-size: 1rem;
    }
  }
`;
