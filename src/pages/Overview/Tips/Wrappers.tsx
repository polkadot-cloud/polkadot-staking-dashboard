// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { motion } from 'framer-motion';
import styled from 'styled-components';
import {
  backgroundLabel,
  networkColor,
  textPrimary,
  textSecondary,
} from 'theme';

export const ItemsWrapper = styled(motion.div)`
  width: 100%;
  display: flex;
  flex-flow: row nowrap;
  justify-items: center;
  margin: 0.25rem 0 0rem 0;
`;
export const ItemWrapper = styled(motion.div)`
  padding: 0;
  flex-basis: 100%;
  &:last-child {
    margin-right: 0.25rem;
  }
`;

export const ItemInnerWrapper = styled.div<{ inactive?: boolean }>`
  border-radius: 1.25rem;
  transition: border 0.05s;
  display: flex;
  flex-flow: row wrap;
  height: 4rem;
  transition: border 0.2s;

  > section {
    height: 100%;

    &:nth-child(1) {
      display: flex;
      flex-flow: row wrap;
      align-items: center;
      padding-right: 0.25rem;

      .lpf {
        fill: ${networkColor};
      }
      .lps {
        stroke: ${networkColor};
      }
    }

    &:nth-child(2) {
      display: flex;
      flex-flow: column nowrap;
      align-items: flex-start;
      justify-content: center;
      flex: 1;

      .title {
        display: flex;
        flex-flow: row nowrap;
        align-items: center;
        text-align: left;
        overflow: hidden;
        position: relative;
        width: 100%;
        height: 1.9rem;
        position: relative;
        top: 0.2rem;

        > h3 {
          position: absolute;
          top: 0;
          left: 0;
          width: auto;
          max-width: 100%;
          color: ${textPrimary};
          font-variation-settings: 'wght' 625;
          margin: 0;
          font-size: 1.2rem;

          padding-right: 6.75rem;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          height: 1.9rem;

          > span {
            position: absolute;
            right: 0;
            min-width: 6.2rem;
            font-variation-settings: 'wght' 500;
            background: ${backgroundLabel};
            color: ${textSecondary};
            font-size: 0.97rem;
            margin-left: 0.25rem;
            padding: 0rem 0.6rem;
            border-radius: 1.5rem;
            opacity: 0.9;
            text-align: center;
          }
        }
      }

      .desc {
        display: flex;
        flex-flow: column nowrap;
        align-items: center;
        justify-content: flex-start;
        overflow: hidden;
        width: 100%;
        height: 1.85rem;
        position: relative;

        h4 {
          color: ${textSecondary};
          position: absolute;
          top: 0;
          left: 0;
          width: auto;
          height: 1.85rem;
          max-width: 100%;
          margin: 0;
          padding: 0.15rem 6.3rem 0rem 0;
          text-align: left;
          font-size: 1.05rem;
          text-overflow: ellipsis;
          white-space: nowrap;
          overflow: hidden;
        }
        .more {
          position: absolute;
          right: 0.2rem;
          top: 0rem;
          display: flex;
          flex-flow: row nowrap;
          align-items: center;
          border: 1px solid ${networkColor};
          color: ${networkColor};
          border-radius: 1.5rem;
          padding: 0rem 0.8rem;
          font-size: 1rem;

          > svg {
            margin-left: 0.4rem;
          }
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
  top: -0.2rem;
  display: flex;
  flex-flow: row wrap;
  margin-left: 0.75rem;

  > button {
    margin: 0 0.5rem;
    opacity: 0.75;
    font-size: 1.1rem;
    transition: color 0.2s;

    > svg {
      color: ${textSecondary};
    }

    &:hover {
      opacity: 1;
      color: ${networkColor};
    }

    &:disabled {
      color: ${textSecondary};
      opacity: 0.1;
    }
  }

  h4 {
    margin: 0;
    span {
      margin: 0 0.5rem;
    }
    &.disabled {
      opacity: 0.25;
    }
  }
`;
