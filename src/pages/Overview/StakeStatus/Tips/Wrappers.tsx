// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { SmallFontSizeMaxWidth } from 'consts';
import { motion } from 'framer-motion';
import styled from 'styled-components';
import { borderPrimary, networkColor, textSecondary } from 'theme';

export const TipsWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-flow: row nowrap;
  position: relative;
  top: 0.25rem;
  margin-top: 0.35rem;
`;

export const ItemsWrapper = styled(motion.div)`
  width: 100%;
  display: flex;
  flex-flow: row nowrap;
  justify-items: center;
  margin: 0.25rem 0 0rem 0;
`;
export const ItemWrapper = styled(motion.div)`
  padding: 0 0.25rem;
  flex-basis: 100%;
  &:last-child {
    margin-right: 0.25rem;
  }
`;

export const ItemInnerWrapper = styled.div<{ inactive?: boolean }>`
  display: flex;
  flex-flow: row wrap;

  > section {
    height: 100%;

    &:nth-child(1) {
      display: flex;
      flex-flow: row wrap;
      align-items: center;
      padding-top: 0.1rem;
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

      .desc {
        display: flex;
        flex-flow: column nowrap;
        align-items: center;
        justify-content: flex-start;
        overflow: hidden;
        width: 100%;
        height: 1.85rem;
        position: relative;

        &:hover {
          h4 {
            color: ${networkColor};
          }
          .more {
            color: ${networkColor};
            opacity: 1;
          }
        }

        h4 {
          color: ${textSecondary};
          position: absolute;
          top: 0;
          left: 0;
          width: auto;
          height: 1.85rem;
          max-width: 100%;
          margin: 0;
          padding: 0.15rem 1.75rem 0rem 0;
          text-align: left;
          font-size: 1.05rem;
          text-overflow: ellipsis;
          white-space: nowrap;
          overflow: hidden;
          transition: color 0.15s;
        }
        .more {
          position: absolute;
          right: 0.2rem;
          top: 0.43rem;
          display: flex;
          flex-flow: row nowrap;
          align-items: center;
          color: ${textSecondary};
          transition: all 0.15s;
          font-size: 1rem;
          opacity: 0.5;
          > svg {
            margin-left: 0.4rem;
          }
        }
      }
    }
  }
`;

export const PageToggleWrapper = styled.div`
  color: ${textSecondary};
  padding: 0.1rem 0.1rem;
  border-radius: 1.5rem;
  border: 1px solid ${borderPrimary};
  position: relative;
  top: 0.1rem;
  display: flex;
  flex-flow: row wrap;
  margin-left: 0.5rem;

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
    @media (max-width: ${SmallFontSizeMaxWidth}px) {
      display: none;
    }
    margin: 0;
    span {
      margin: 0 0.5rem;
    }
    &.disabled {
      opacity: 0.25;
    }
  }
`;
