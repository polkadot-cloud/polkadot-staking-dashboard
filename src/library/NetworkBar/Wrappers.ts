// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import styled from 'styled-components';
import { SideMenuStickyThreshold } from 'consts';

export const Wrapper = styled.div`
  --network-bar-font-size: 0.9rem;

  background: var(--background-app-footer);
  color: var(--text-color-secondary);
  font-size: var(--network-bar-font-size);
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  bottom: 0px;
  left: 0px;
  overflow: hidden;
  z-index: 6;
  backdrop-filter: blur(4px);
  position: relative;
  padding-top: 0.15rem;
  width: 100%;

  @media (min-width: ${SideMenuStickyThreshold + 1}px) {
    position: fixed;
  }

  .network_icon {
    margin: 0 0 0 1.25rem;
    width: 1.5rem;
    height: 1.5rem;
  }
`;

export const Summary = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  align-content: center;

  /* hide connection status text on small screens */
  .hide-small {
    display: flex;
    align-items: center;
    align-content: center;

    @media (max-width: 600px) {
      display: none;
    }
  }

  a,
  button {
    color: var(--text-color-secondary);
    font-size: var(--network-bar-font-size);
    opacity: 0.75;
  }
  p {
    font-size: var(--network-bar-font-size);
    border-left: 1px solid var(--accent-color-transparent);
    margin: 0.25rem 0.5rem 0.25rem 0.15rem;
    padding-left: 0.5rem;
    line-height: 1.3rem;
  }
  .stat {
    margin: 0 0.25rem;
    display: flex;
    align-items: center;

    &.last {
      margin-left: 1rem;
    }
  }

  /* left and right sections for each row*/
  > section {
    color: var(--text-color-secondary);
    padding: 0.5rem 0;

    /* left section */
    &:nth-child(1) {
      display: flex;
      flex-flow: row wrap;
      align-items: center;
      flex-grow: 1;
    }

    /* right section */
    &:last-child {
      flex-grow: 1;
      display: flex;
      align-items: center;
      flex-flow: row-reverse wrap;
      padding-right: 0.75rem;

      button {
        font-size: var(--network-bar-font-size);
        color: var(--text-color-secondary);
        border-radius: 0.4rem;
        padding: 0.25rem 0.5rem;
      }
      span {
        &.pos {
          color: #3eb955;
        }
        &.neg {
          color: #d2545d;
        }
      }
    }
  }
`;

export const Separator = styled.div`
  border-left: 1px solid var(--text-color-secondary);
  opacity: 0.2;
  margin: 0 0.3rem;
  width: 1px;
  height: 1rem;
`;
