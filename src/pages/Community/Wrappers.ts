// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import styled from 'styled-components';
import { motion } from 'framer-motion';
import { textSecondary, borderPrimary } from 'theme';

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
  width: 50%;
  margin: 1rem 1rem 0 0;

  height: 14rem;
  @media (min-width: ${VERTICAL_THRESHOLD + 1}px) {
    flex-basis: 33%;
    height: 10rem;
  }

  > .inner {
    color: ${textSecondary};
    box-sizing: border-box;
    background: rgba(0, 0, 0, 0.03);
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
      padding: 0 1rem;

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

        h2 {
          margin-top: 0.75rem;
          margin-bottom: 0.9rem;
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
          width: 11rem;

          svg {
            width: 7rem;
            height: 7rem;
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
        }
      }
    }
  }
`;
