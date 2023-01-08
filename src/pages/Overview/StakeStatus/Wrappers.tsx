// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import styled from 'styled-components';
import { borderPrimary } from 'theme';

export const StatusWrapper = styled.div<{ includeBorder: boolean }>`
  width: 100%;
  display: flex;
  flex-flow: column nowrap;
  margin-top: 0.25rem;
  position: relative;
  top: ${(props) => (props.includeBorder ? '-0.1rem' : 0)};
  > div {
    &:last-child {
      margin-bottom: 0;
      ${(props) =>
        props.includeBorder !== true
          ? `
        border-bottom: none;
        margin-bottom: 0;
        padding-bottom: 0;`
          : ``};
    }
  }
`;

export const StatusRowWrapper = styled.div<{ leftIcon?: boolean }>`
  width: 100%;
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  border-bottom: 1px solid ${borderPrimary};
  padding-bottom: 0.75rem;
  margin-bottom: 0.75rem;

  > div {
    display: flex;
    flex-flow: row nowrap;
    align-items: center;
    position: relative;
    flex-grow: 1;
  }

  button {
    border: none;
  }

  .content {
    display: flex;
    flex-flow: column nowrap;
    align-items: center;
    justify-content: flex-start;
    overflow: hidden;
    width: auto;
    height: 2rem;
    position: relative;
    margin: 0;
    width: 100%;

    .text {
      font-size: 1.25rem;
      line-height: 1.55rem;
      position: absolute;
      top: 0;
      left: 0;
      width: auto;
      max-width: 100%;
      height: 2rem;
      max-width: 100%;
      padding: ${(props) =>
        props.leftIcon ? '0.15rem 8.5rem 0 1.85rem' : '0.15rem 8.5rem 0 0'};
      text-align: left;
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
    }
    .bull {
      position: absolute;
      left: 0rem;
      top: 0.32rem;
      margin-right: 0.75rem;
    }
    .cta {
      position: absolute;
      right: 0.2rem;
      top: 0rem;
    }
  }
`;
