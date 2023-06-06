// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { SideMenuStickyThreshold } from 'consts';
import styled from 'styled-components';

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
  @media (max-width: ${SideMenuStickyThreshold}px) {
    padding: 0;
  }
`;

export const StatusRowWrapper = styled.div<{ leftIcon?: boolean }>`
  border-bottom: 1px solid var(--border-primary-color);
  width: 100%;
  display: flex;
  align-items: center;
  padding: 1.1rem 1.15rem;

  > div {
    display: flex;
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
    overflow: hidden;
    width: auto;
    height: 1.75rem;
    position: relative;
    margin: 0;
    width: 100%;

    .text {
      color: var(--text-color-primary);
      font-size: 1.25rem;
      position: absolute;
      top: 0;
      left: 0;
      width: auto;
      max-width: 100%;
      padding: ${(props) =>
        props.leftIcon ? '0.18rem 0 0 2rem' : '0.18rem 0 0 0'};
      text-align: left;
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
    }
    .bull {
      position: absolute;
      left: 0rem;
      top: 0.36rem;

      &.off {
        opacity: 0.1;
      }
      &.active {
        color: var(--network-color-primary);
      }
      &.inactive {
        color: var(--button-secondary-background);
      }
    }
    .cta {
      position: absolute;
      right: 0.2rem;
      top: -0.18rem;
    }
  }
`;
