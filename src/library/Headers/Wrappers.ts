// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { motion } from 'framer-motion';
import styled from 'styled-components';
import {
  ShowAccountsButtonWidthThreshold,
  SideMenuStickyThreshold,
} from 'consts';

export const Wrapper = styled.div`
  position: fixed;
  top: 0px;
  right: 0px;
  display: flex;
  flex-flow: row wrap;
  justify-content: flex-end;
  align-items: center;
  align-content: center;
  padding: 0 1.25rem;
  transition: all var(--transition-duration);
  margin: 0.5rem 0;
  height: 4rem;
  z-index: 6;

  @media (max-width: ${SideMenuStickyThreshold}px) {
    width: 100%;
  }

  .menu {
    display: none;
    @media (max-width: ${SideMenuStickyThreshold}px) {
      color: var(--text-color-secondary);
      display: flex;
      flex-flow: row wrap;
      align-items: center;
      flex-grow: 1;
    }
  }
`;

export const ConnectedAccount = styled(motion.div)`
  background: var(--accent-color-primary);
  border-radius: 1.5rem;
  display: flex;
  transition: transform var(--transition-duration);
  padding: 0.1rem 0.75rem;

  &:hover {
    transform: scale(1.015);
  }

  > span {
    border-right: 1px solid var(--text-color-invert);
    opacity: 0.2;
    margin: 0 0.4rem;
  }
`;

export const HeadingWrapper = styled.div`
  display: flex;
  flex-flow: row wrap;
  justify-content: flex-end;
  margin-left: 0.9rem;
`;

export const Item = styled.button`
  background: var(--button-tab-background);
  border: 1px solid var(--border-primary-color);
  flex-grow: 1;
  padding: 0.05rem 1rem;
  border-radius: 1.5rem;
  box-shadow: none;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  font-size: 1.05rem;
  transition: transform var(--transition-duration) ease-out;

  &:hover {
    transform: scale(1.03);
  }

  .label {
    color: var(--accent-color-primary);
    border: 0.125rem solid var(--accent-color-primary);
    border-radius: 0.8rem;
    font-size: 0.85rem;
    margin-right: 0.6rem;
    padding: 0.1rem 0.5rem;
  }

  > span {
    color: white;
    line-height: 2.2rem;
    .icon {
      color: var(--text-color-secondary);
      cursor: pointer;
    }
  }

  &.connect {
    background: var(--accent-color-primary);
    > span {
      color: white;
    }
    .icon {
      margin-right: 0.6rem;
      path {
        fill: white;
      }
    }
  }
`;

export const ItemInactive = styled(motion.div)`
  background: var(--button-secondary-background);
  flex-grow: 1;
  padding: 0 1rem;
  border-radius: 1rem;
  display: flex;
  flex-flow: column nowrap;
  justify-content: center;
  align-items: center;
  font-size: 1rem;

  > span {
    color: var(--text-color-primary);
    line-height: 2.2rem;
  }
`;

export const LargeScreensOnly = styled.div`
  display: flex;
  @media (max-width: ${ShowAccountsButtonWidthThreshold}px) {
    display: none;
  }
`;
