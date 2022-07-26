// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import styled from 'styled-components';
import { motion } from 'framer-motion';

import {
  textSecondary,
  textInvert,
  backgroundSecondary,
  tooltipBackground,
  cardShadow,
  shadowColor,
  borderPrimary,
  cardBorder,
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
`;

export const StatBoxWrapper = styled(motion.div)`
  display: flex;
  flex-flow: column wrap;
  z-index: 0;
  flex-basis: 100%;
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
    font-size: 1.2rem;
  }

  @media (min-width: 950px) {
    max-width: 300px;
    h3 {
      font-size: 1.25rem;
    }
  }

  .content {
    border: ${cardBorder} ${borderPrimary};
    box-shadow: ${cardShadow} ${shadowColor};
    background: ${backgroundSecondary};
    display: flex;
    border-radius: 0.95rem;
    margin-right: 1.25rem;
    padding: 0.9rem 0;
    max-height: 3.4rem;
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

      .assistant-icon {
        margin-left: 0.6rem;
      }
    }

    > .chart {
      position: relative;
      display: flex;
      flex-flow: row nowrap;
      justify-content: center;
      align-items: center;
      padding-left: 1rem;

      .graph {
        opacity: 0.75;
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
        width: auto;
        max-width: 200px;
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
          color: red;
          margin-top: 0.15rem;
        }

        span.total {
          color: ${textSecondary};
          font-size: 0.9rem;
          margin-left: 0.4rem;
          margin-top: 0rem;
        }
      }
    }
  }
`;

export default Wrapper;
