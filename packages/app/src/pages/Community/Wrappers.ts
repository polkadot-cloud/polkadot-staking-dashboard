// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { motion } from 'framer-motion';
import styled from 'styled-components';

const VERTICAL_THRESHOLD = 800;

export const Wrapper = styled.div`
  h2 {
    color: var(--text-color-secondary);
    margin-top: 2rem;
    margin-bottom: 1rem;
  }
`;
export const ItemsWrapper = styled(motion.div)`
  display: flex;
  flex-flow: row wrap;
  width: 100%;
`;

export const ItemWrapper = styled(motion.div)`
  flex-shrink: 0;
  flex-grow: 1;
  flex-basis: 100%;
  margin: 1rem 1rem 0 0;

  height: auto;
  @media (min-width: ${VERTICAL_THRESHOLD + 1}px) {
    height: 8.8rem;
  }

  > .inner {
    color: var(--text-color-secondary);
    background: var(--background-primary);
    box-shadow: var(--card-shadow);
    border-radius: 0.75rem;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    flex-flow: column wrap;
    justify-content: center;

    svg {
      border-radius: 0.74rem;
    }

    /* vertical validator icon / content tiling */
    section {
      display: flex;
      flex-flow: column wrap;
      padding: 0 1rem;
      overflow: hidden;

      h3 {
        display: flex;
        flex-flow: row wrap;
        align-items: center;

        > button {
          font-size: 1.1rem;
          &.active {
            color: var(--text-color-secondary);
            background: var(--background-list-item);
            &:hover {
              background: var(--background-list-item);
            }
          }
          padding: 0.35rem 0.75rem;
          margin-left: 0.75rem;
        }
      }

      button {
        display: flex;
        flex-flow: row wrap;
        align-items: center;
        border-radius: 1rem;
        padding: 0.3rem 1rem;

        svg {
          color: var(--text-color-secondary);
        }

        margin: 0.5rem 1rem 0.5rem 0;
        @media (min-width: ${VERTICAL_THRESHOLD + 1}px) {
          margin: 0.25rem 1rem 0.25rem 0;
        }
        &:disabled {
          cursor: default;
        }
        &.active {
          background: var(--button-secondary-background);
          transition: background var(--transition-duration);
          &:hover {
            background: var(--button-hover-background);
          }
        }
        &:last-child {
          margin-right: none;
        }
        .icon-left {
          margin-right: 0.5rem;
        }
        .icon-right {
          margin-left: 0.65rem;
          opacity: 0.75;
        }
      }

      > .stats {
        display: flex;
        flex-flow: row wrap;
        width: 100%;
        margin-top: 0rem;
        margin-bottom: 1rem;
        @media (min-width: ${VERTICAL_THRESHOLD + 1}px) {
          margin-top: 0.25rem;
          margin-bottom: 0;
        }
      }

      &:first-child {
        flex-flow: row wrap;
        align-items: center;
        width: 100%;
        padding: 1rem;
        svg {
          width: 4.5rem;
          height: 4.5rem;
        }
      }
      &:last-child {
        border-top: 1px solid var(--border-primary-color);
        border-left: none;
        flex-flow: column wrap;
        justify-content: center;
        height: 100%;
        height: 50%;
        width: 100%;
        flex: 1;

        h3 {
          margin-top: 0.5rem;
          margin-bottom: 0.4rem;
        }
      }
    }

    /* horizontal validator icon / content tiling */
    @media (min-width: ${VERTICAL_THRESHOLD + 1}px) {
      flex-flow: row wrap;
      section {
        padding: 0 1.5rem;
        justify-content: flex-start;

        &:first-child {
          flex-flow: row wrap;
          align-items: center;
          justify-content: flex-start;
          height: 100%;
          width: 7rem;

          svg {
            width: 4.5rem;
            height: 4.5rem;
          }
        }
        &:last-child {
          padding: 1rem 0;
          align-items: center;
          flex-flow: column wrap;
          align-items: flex-start;
          justify-content: center;
          border-left: none;
          border-top: none;
          height: 100%;
          flex: 1;

          h3 {
            margin-top: 0.25rem;
          }
        }
      }
    }
  }
`;
