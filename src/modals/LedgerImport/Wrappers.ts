// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { motion } from 'framer-motion';
import styled from 'styled-components';

export const SplashWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-flow: column wrap;
  align-items: center;
  justify-content: center;

  .icon {
    width: 100%;
    display: flex;
    justify-content: center;
    z-index: 0;
    margin-bottom: 2rem;
  }

  .content {
    z-index: 1;
    display: flex;
    flex-flow: column nowrap;
    justify-content: center;

    h4 {
      margin-bottom: 0.5rem;
    }
    h2,
    h4,
    h5 {
      color: var(--text-color-secondary);
      text-align: center;
      margin-top: 0.35rem;
      svg {
        margin-right: 0.3rem;
      }
    }
    h5 {
      min-height: 2rem;
    }
    button {
      cursor: pointer;
      z-index: 1;
      padding: 0.5rem 1.75rem !important;
      font-variation-settings: 'wght' 650;
    }
  }
`;

export const StatusBarWrapper = styled(motion.div)`
  background: var(--background-primary);
  padding: 0 0.5rem 0.5rem 0.5rem;
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;

  > .inner {
    background: var(--background-list-item);
    border-radius: 1rem;
    display: flex;
    align-items: center;
    padding: 0.7rem 1rem;

    > div {
      display: flex;
      align-items: center;

      &:first-child {
        flex-grow: 1;
        .text {
          flex: 1;
          flex-direction: column;
        }
      }
      &:last-child {
        flex-shrink: 1;
        justify-content: flex-end;
        button {
          margin-left: 0.75rem;
        }
      }
    }

    .ledgerIcon {
      margin: 0 1rem 0 0.25rem;
      path {
        fill: var(--text-color-primary);
      }
    }
    h3,
    h5 {
      flex: 1;
      margin: 0;
    }
    h5 {
      margin-top: 0.25rem;
    }
  }
`;

export const TitleWrapper = styled.div`
  --tab-height: 2.25rem;

  background: var(--background-primary);
  -webkit-app-region: drag;
  padding: 0.95rem 0.85rem 0.7rem 0.85rem;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 3;
  display: flex;
  flex-direction: column;

  .tabs {
    width: 100%;
    height: var(--tab-height);
    display: flex;
    margin: 0.5rem 0 0.1rem 0;

    button {
      padding: 0rem 1rem;
      transition: background 0.15s;
      height: var(--tab-height);
      border-radius: 0.4rem;
      margin-right: 0.75rem;

      > div {
        height: var(--tab-height);
        display: flex;
        align-items: center;
      }
      &:hover {
        background: var(--background-secondary);
      }
      &.active {
        background: var(--background-secondary);
      }
    }
  }

  > h4 {
    margin: 0;
  }
  > h5 {
    svg {
      margin-right: 0.4rem;
    }
  }
`;
