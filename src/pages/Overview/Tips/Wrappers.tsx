// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import styled from 'styled-components';
import {
  backgroundLabel,
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
  margin: 0.5rem 0;
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
    border-radius: 1.25rem;
    box-sizing: border-box;
    padding: 0rem 1rem;
    transition: border 0.05s;
    display: flex;
    flex-flow: row wrap;
    height: 5.75rem;

    > section {
      height: 100%;

      &:first-child {
        display: flex;
        flex-flow: row wrap;
        align-items: center;
        padding-right: 1rem;

        .lpf {
          fill: ${textPrimary};
        }
        .lps {
          stroke: ${textPrimary};
        }
      }

      &:last-child {
        display: flex;
        flex-flow: column nowrap;
        align-items: flex-start;
        justify-content: center;
        flex: 1;

        h4 {
          color: ${textPrimary};
          font-variation-settings: 'wght' 625;
          margin: 0;
          font-size: 1.15rem;
        }

        .desc {
          display: flex;
          flex-flow: column wrap;
          justify-content: flex-start;
          overflow: hidden;
          p {
            color: ${textSecondary};
            margin: 0.3rem 0 0rem 0;
            text-align: left;
            font-size: 1rem;
          }
        }
      }
    }

    &:hover {
      border-color: ${networkColor};

      > section:first-child {
        .lpf {
          fill: ${networkColor};
        }
        .lps {
          stroke: ${networkColor};
        }
      }
    }
  }
`;

export const PageToggleWrapper = styled.div`
  background: ${backgroundLabel};
  color: ${textSecondary};
  padding: 0.25rem 0.5rem;
  border-radius: 1.5rem;
  position: relative;
  top: -0.25rem;
  display: flex;
  flex-flow: row wrap;

  > button {
    margin: 0;
    opacity: 0.75;
    transition: color 0.2s;

    &:hover {
      opacity: 1;
      color: ${networkColor};
    }
  }

  h4 {
    margin: 0;

    span {
      margin: 0 0.5rem;
    }
  }
`;
