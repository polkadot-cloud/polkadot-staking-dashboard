// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import styled from 'styled-components';
import {
  backgroundDropdown,
  borderPrimary,
  networkColor,
  shadowColorSecondary,
  textPrimary,
  textSecondary,
} from 'theme';
import { motion } from 'framer-motion';

export const ItemsWrapper = styled(motion.div)`
  width: 100%;
  box-sizing: border-box;
  display: flex;
  flex-flow: row nowrap;
  justify-items: center;
  margin: 0.25rem 0;
`;
export const ItemWrapper = styled(motion.button)`
  padding: 0;
  flex-grow: 1;
  flex-basis: 33%;
  margin-left: 0.25rem;
  margin-right: 1rem;

  &:last-child {
    margin-right: 0.25rem;
  }

  > .inner {
    box-shadow: -1px 3px 4px ${shadowColorSecondary};
    border: 1px solid ${borderPrimary};
    display: flex;
    flex-flow: column wrap;
    justify-content: center;
    align-items: flex-start;
    border-radius: 1.25rem;
    box-sizing: border-box;
    padding: 0rem 1.25rem;
    transition: background 0.25s, border 0.25s;
    height: 6.5rem;

    &:hover {
      background: ${backgroundDropdown};
      border-color: ${networkColor};
    }

    h4 {
      color: ${textPrimary};
      font-variation-settings: 'wght' 625;
      margin: 1.25rem 0 0 0;
    }

    .desc {
      flex-grow: 1;
      display: flex;
      flex-flow: column wrap;
      justify-content: flex-start;
      overflow: hidden;
    }
    p {
      color: ${textSecondary};
      margin: 0.6rem 0 0.25rem 0;
      text-align: left;
    }
  }
`;
