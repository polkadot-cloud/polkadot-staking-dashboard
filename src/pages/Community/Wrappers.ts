// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import styled from 'styled-components';
import { motion } from 'framer-motion';
import {
  textSecondary,
  borderPrimary,
  backgroundSecondary,
  cardBorder,
  shadowColor,
  cardShadow,
  backgroundDropdown,
  buttonSecondaryBackground,
  buttonHoverBackground,
} from 'theme';

const VERTICAL_THRESHOLD = 800;

export const Wrapper = styled.div`
  h2 {
    color: ${textSecondary};
    margin-top: 2rem;
  }
`;
export const ItemsWrapper = styled(motion.div)`
  display: flex;
  flex-flow: row wrap;
  width: 100%;
`;

export const ItemWrapper = styled(motion.div)`
  box-sizing: border-box;
  flex-shrink: 0;
  flex-grow: 1;
  flex-basis: 100%;
  margin: 1rem 1rem 0 0;

  height: auto;
  @media (min-width: ${VERTICAL_THRESHOLD + 1}px) {
    height: 10rem;
  }

  > .inner {
    color: ${textSecondary};
    background: ${backgroundSecondary};
    border: ${cardBorder} ${borderPrimary};
    box-shadow: ${cardShadow} ${shadowColor};
    box-sizing: border-box;
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

    /* vertical validator thumbnail / content tiling */
    section {
      box-sizing: border-box;
      display: flex;
      flex-flow: column wrap;
      padding: 0 1rem;
      overflow: hidden;

      h3 {
        display: flex;
        flex-flow: row wrap;
        align-items: center;

        > button {
          &.active {
            color: ${textSecondary};
            background: ${backgroundDropdown};
            &:hover {
              background: ${backgroundDropdown};
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
          color: ${textSecondary};
        }

        margin: 0.5rem 1rem 0.5rem 0;
        @media (min-width: ${VERTICAL_THRESHOLD + 1}px) {
          margin: 0.25rem 1rem 0.25rem 0;
        }
        > h4 {
          margin: 0;
        }
        &:disabled {
          cursor: default;
        }
        &.active {
          background: ${buttonSecondaryBackground};
          transition: background 0.1s;
          &:hover {
            background: ${buttonHoverBackground};
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
        box-sizing: border-box;
        flex-flow: row wrap;
        align-items: center;
        justify-content: flex-start;
        width: 100%;
        padding: 1rem;
        svg {
          width: 4.5rem;
          height: 4.5rem;
        }
      }
      &:last-child {
        border-left: none;
        flex-flow: column wrap;
        align-items: flex-start;
        justify-content: center;
        border-top: 1px solid ${borderPrimary};
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

    /* horizontal validator thumbnail / content tiling */
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
          width: 7.5rem;

          svg {
            width: 5rem;
            height: 5rem;
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
