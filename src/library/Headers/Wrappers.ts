// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import {
  ShowAccountsButtonWidthThreshold,
  SideMenuStickyThreshold,
} from 'consts';
import { motion } from 'framer-motion';
import styled from 'styled-components';
import {
  borderPrimary,
  buttonSecondaryBackground,
  networkColor,
  textPrimary,
  textSecondary,
} from 'theme';

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
  transition: all 0.15s;
  margin: 0.5rem 0;
  height: 4rem;
  z-index: 6;

  @media (max-width: ${SideMenuStickyThreshold}px) {
    width: 100%;
  }

  .menu {
    display: none;
    @media (max-width: ${SideMenuStickyThreshold}px) {
      color: ${textSecondary};
      display: flex;
      flex-flow: row wrap;
      justify-content: flex-start;
      align-items: center;
      flex-grow: 1;
    }
  }
`;

export const HeadingWrapper = styled.div`
  display: flex;
  flex-flow: row wrap;
  justify-content: flex-end;
  margin-left: 0.9rem;
`;

export const Item = styled(motion.button)`
  background: ${buttonSecondaryBackground};
  border: 1px solid ${borderPrimary};
  flex-grow: 1;
  padding: 0.05rem 1rem;
  border-radius: 1.5rem;
  box-shadow: none;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  font-size: 1.05rem;

  .label {
    color: ${networkColor};
    border: 0.125rem solid ${networkColor};
    border-radius: 0.8rem;
    font-size: 0.85rem;
    margin-right: 0.6rem;
    padding: 0.1rem 0.5rem;
  }

  > span {
    color: white;
    line-height: 2.2rem;
  }

  &.connect {
    background: ${networkColor};
    > span {
      color: 'white';
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
  flex-grow: 1;
  padding: 0 1rem;
  border-radius: 1rem;
  background: ${buttonSecondaryBackground};
  display: flex;
  flex-flow: column nowrap;
  justify-content: center;
  align-items: center;
  font-size: 1rem;

  > span {
    color: ${textPrimary};
    line-height: 2.2rem;
  }
`;

export const LargeScreensOnly = styled.div`
  display: flex;
  @media (max-width: ${ShowAccountsButtonWidthThreshold}px) {
    display: none;
  }
`;
