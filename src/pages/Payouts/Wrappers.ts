// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { motion } from 'framer-motion';
import styled from 'styled-components';

export const ItemWrapper = styled(motion.div)`
  padding: 0.5rem;
  width: 100%;

  > .inner {
    background: var(--background-list-item);
    padding: 0 0.75rem;
    flex: 1;
    box-shadow: 0px 1.75px 0px 1.25px var(--card-shadow-color-secondary);
    border-radius: 1rem;
    display: flex;
    flex-flow: column wrap;
    align-items: center;
    flex: 1;
    max-width: 100%;

    > .row {
      width: 100%;
      display: flex;
      flex-flow: row wrap;
      align-items: center;

      &:first-child {
        padding: 1rem 0 0.75rem 0;
      }

      &:last-child {
        border-top: 1px solid var(--border-primary-color);
        padding-top: 0rem;

        > div {
          min-height: 3.2rem;
        }
      }

      > div {
        display: flex;
        flex-flow: row wrap;
        align-items: center;
        flex: 1;
        max-width: 100%;

        h4 {
          color: var(--text-color-secondary);
          font-variation-settings: 'wght' 575;
          &.claim {
            color: var(--network-color-secondary);
          }
          &.reward {
            color: var(--network-color-primary);
          }
        }

        h5 {
          color: var(--text-color-secondary);
          margin: 0;
          &.claim {
            color: var(--network-color-secondary);
            border: 1px solid var(--network-color-secondary);
            border-radius: 0.75rem;
            padding: 0.2rem 0.5rem;
          }
          &.reward {
            color: var(--network-color-primary);
            border: 1px solid var(--network-color-primary);
            border-radius: 0.75rem;
            padding: 0.2rem 0.5rem;
          }
        }

        > div:first-child {
          flex-grow: 1;
          display: flex;
          flex-flow: row wrap;
          align-items: center;
        }

        > div:last-child {
          display: flex;
          flex-flow: row wrap;
          justify-content: flex-end;

          > h4 {
            color: var(--text-color-secondary);
            opacity: 0.8;
          }
        }
      }
    }
  }
`;
