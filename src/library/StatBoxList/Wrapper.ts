// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { motion } from 'framer-motion';
import styled from 'styled-components';

import {
  backgroundSecondary,
  borderPrimary,
  cardBorder,
  cardShadow,
  networkColor,
  shadowColor,
  shadowColorSecondary,
  textInvert,
  textPrimary,
  textSecondary,
  tooltipBackground,
} from 'theme';

export const Wrapper = styled.div`
  display: flex;
  flex-flow: column nowrap;
  justify-content: flex-start;
`;

export const ListWrapper = styled.div`
  display: flex;
  flex-flow: row wrap;
  padding-top: 1rem;

  > div:last-child {
    margin-bottom: 0;
    .content {
      margin-right: 0;
    }
  }
`;

export const StatBoxWrapper = styled(motion.div)`
  display: flex;
  flex-flow: column wrap;
  z-index: 0;
  flex: 1;
  flex-basis: 100%;
  margin-bottom: 1rem;

  @media (min-width: 800px) {
    flex-basis: 33%;
    min-width: 200px;
    max-width: none;
    margin-bottom: 0;
  }

  /* responsive screen sizing */
  h3 {
    font-variation-settings: 'wght' 580;
    font-size: 1.2rem;
  }
  @media (min-width: 950px) {
    max-width: 300px;
    h3 {
      font-size: 1.25rem;
    }
  }

  .content {
    background: ${backgroundSecondary};
    border: ${cardBorder} ${borderPrimary};
    box-shadow: ${cardShadow} ${shadowColorSecondary};
    @media (max-width: 799px) {
      box-shadow: ${cardShadow} ${shadowColor};
    }
    display: flex;
    border-radius: 0.95rem;
    margin-right: 1.25rem;
    padding: 0.9rem 0rem;
    max-height: 5.25rem;
    flex-flow: row wrap;

    @media (max-width: 749px) {
      margin-right: 0;
      padding: 0.9rem 0;
    }

    h3,
    h4 {
      margin: 0;
    }

    h4 {
      flex: 1;
      display: flex;
      flex-flow: row wrap;
      align-items: center;

      .help-icon {
        margin-left: 0.6rem;
      }
    }

    > .chart {
      position: relative;
      display: flex;
      justify-content: center;
      align-items: center;
      padding-left: 1rem;

      .graph {
        overflow: hidden;
      }

      .tooltip {
        background: ${tooltipBackground};
        opacity: 0;
        position: absolute;
        top: -20px;
        left: -8px;
        z-index: 2;
        border-radius: 0.5rem;
        padding: 0 0.5rem;
        width: max-content;
        max-width: 250px;
        transition: opacity 0.1s;

        h3 {
          text-align: center;
          color: ${textInvert};
          margin: 0;
          font-size: 0.9rem;
        }
      }

      &:hover {
        .tooltip {
          opacity: 1;
        }
      }
    }

    > .labels {
      padding-left: 1.25rem;
      flex-basis: 70%;
      flex: 1;
      display: flex;
      flex-flow: column wrap;
      justify-content: center;
      overflow: hidden;

      h3 {
        display: flex;
        flex-flow: row wrap;
        justify-content: flex-start;
        align-items: flex-start;
        margin-bottom: 0.3rem;

        &.text {
          margin-top: 0.15rem;
        }

        span.total {
          color: ${textSecondary};
          font-size: 0.95rem;
          margin-left: 0.4rem;
          position: relative;
          bottom: 0.1rem;
        }
      }
    }
  }
`;

export const TextTitleWrapper = styled.div<{ primary?: boolean }>`
  color: ${(props) => (props.primary === true ? networkColor : textPrimary)};
  font-variation-settings: 'wght' 580;
  display: flex;
  flex-flow: row wrap;
  justify-content: flex-start;
  align-items: flex-start;
  margin-bottom: 0.15rem;
  font-size: 1.2rem;
  @media (min-width: 950px) {
    max-width: 300px;
    font-size: 1.25rem;
  }

  &.text {
    margin-top: 0.15rem;
  }

  span {
    color: ${textSecondary};
    font-size: 0.95rem;
    margin-left: 0.55rem;
    margin-top: 0.1rem;
    opacity: 0.85;
  }
`;

export const TimeLeftWrapper = styled.div<{ primary?: boolean }>`
  color: ${(props) => (props.primary === true ? networkColor : textPrimary)};
  font-variation-settings: 'wght' 550;
  display: flex;
  flex-flow: row wrap;
  justify-content: flex-start;
  align-items: flex-start;
  font-size: 1.2rem;
  @media (min-width: 950px) {
    max-width: 300px;
    font-size: 1.25rem;
  }

  &.text {
    margin-top: 0.15rem;
  }

  span {
    color: ${textSecondary};
    font-variation-settings: 'wght' 500;
    font-size: 0.95rem;
    margin-left: 0.3rem;
    margin-top: 0.1rem;
    margin-right: 0.75rem;
    opacity: 0.85;
  }
`;

export default Wrapper;
