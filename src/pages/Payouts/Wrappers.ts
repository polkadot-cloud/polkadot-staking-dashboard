// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import styled from 'styled-components';
import { motion } from 'framer-motion';
import {
  backgroundValidator,
  textSecondary,
  networkColor,
  networkColorSecondary,
  borderPrimary,
} from 'theme';

export const ItemWrapper = styled(motion.div)`
  padding: 0.5rem;
  width: 100%;
  > .inner {
    padding: 0 0.75rem;
    flex: 1;
    background: ${backgroundValidator};
    border: 1px solid ${borderPrimary};
    border-radius: 0.75rem;
    display: flex;
    flex-flow: column wrap;
    justify-content: flex-start;
    align-items: center;
    flex: 1;
    max-width: 100%;
    > .row {
      width: 100%;
      display: flex;
      flex-flow: row wrap;
      align-items: center;
      &:first-child {
        padding: 0.75rem 0;
      }
      &:last-child {
        padding-top: 1rem;
        border-top: 1px solid ${borderPrimary};
        padding-top: 0.25rem;
        > div {
          min-height: 3.2rem;
        }
      }
      > div {
        display: flex;
        flex-flow: row wrap;
        justify-content: flex-start;
        align-items: center;
        flex: 1;
        max-width: 100%;
        h4 {
          margin: 0;
          color: ${textSecondary};
          font-variation-settings: 'wght' 575;
          &.claim {
            color: ${networkColorSecondary};
          }
          &.reward {
            color: ${networkColor};
          }
        }
        h5 {
          margin: 0;
          color: ${textSecondary};
          &.claim {
            color: ${networkColorSecondary};
            border: 1px solid ${networkColorSecondary};
            border-radius: 0.75rem;
            padding: 0.2rem 0.5rem;
          }
          &.reward {
            color: ${networkColor};
            border: 1px solid ${networkColor};
            border-radius: 0.75rem;
            padding: 0.2rem 0.5rem;
          }
        }
        > div:first-child {
          flex-grow: 1;
          display: flex;
          flex-flow: row wrap;
          justify-content: flex-start;
          align-items: center;
        }
        > div:last-child {
          display: flex;
          flex-flow: row wrap;
          justify-content: flex-end;
          > h4 {
            color: ${textSecondary};
            opacity: 0.8;
          }
        }
      }
    }
  }
`;
