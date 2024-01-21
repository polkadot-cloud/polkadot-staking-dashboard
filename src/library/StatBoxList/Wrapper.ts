// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { motion } from 'framer-motion';
import styled from 'styled-components';

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
    font-size: 1.2rem;
  }
  @media (min-width: 950px) {
    max-width: 300px;
    h3 {
      font-size: 1.25rem;
    }
  }

  .content {
    background: var(--background-primary);
    box-shadow: var(--card-shadow-secondary);

    @media (max-width: 799px) {
      box-shadow: var(--card-shadow);
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

    h4 {
      font-family: Inter, sans-serif;
      flex: 1;
      display: flex;
      flex-flow: row wrap;
      align-items: center;
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
        background: var(--background-invert);
        opacity: 0;
        position: absolute;
        top: -20px;
        left: -8px;
        z-index: 2;
        border-radius: 0.5rem;
        padding: 0 0.5rem;
        width: max-content;
        max-width: 250px;
        transition: opacity var(--transition-duration);

        h3 {
          color: var(--text-color-invert);
          font-family: InterSemiBold, sans-serif;
          text-align: center;
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
        font-family: InterBold, sans-serif;
        display: flex;
        flex-flow: row wrap;
        margin-top: 0.1rem;
        margin-bottom: 0.1rem;

        &.text {
          margin-top: 0.15rem;
          display: flex;
          align-items: center;
        }
        span.total {
          color: var(--text-color-secondary);
          display: flex;
          font-size: 0.95rem;
          margin-left: 0.4rem;
          position: relative;
          bottom: 0.1rem;
        }
      }
    }
  }
`;

export const TextTitleWrapper = styled.div<{ $primary?: boolean }>`
  color: ${(props) =>
    props.$primary === true
      ? 'var(--accent-color-primary)'
      : 'var(--text-color-primary)'};
  font-family: InterBold, sans-serif;
  display: flex;
  flex-flow: row wrap;
  margin-bottom: 0.35rem;

  font-size: 1.2rem;
  @media (min-width: 950px) {
    max-width: 300px;
    font-size: 1.25rem;
  }

  &.text {
    margin-top: 0.15rem;
  }

  span {
    color: var(--text-color-primary);
    font-family: InterSemiBold, sans-serif;
    font-size: 0.95rem;
    margin-left: 0.55rem;
    margin-top: 0.1rem;
  }
`;

export const TimeLeftWrapper = styled.div<{ primary?: boolean }>`
  color: ${(props) =>
    props.primary === true
      ? 'var(--accent-color-primary)'
      : 'var(--text-color-primary)'};
  font-family: InterBold, sans-serif;
  display: flex;
  flex-flow: row wrap;
  font-size: 1.2rem;
  @media (min-width: 950px) {
    max-width: 300px;
    font-size: 1.25rem;
  }
  margin-bottom: 0.15rem;

  span {
    color: var(--text-color-primary);
    font-family: InterSemiBold, sans-serif;
    font-size: 0.95rem;
    margin-left: 0.3rem;
    margin-top: 0.1rem;
    margin-right: 0.75rem;
  }
`;
