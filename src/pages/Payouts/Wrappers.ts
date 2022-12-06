// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { motion } from 'framer-motion';
import styled from 'styled-components';
import {
  backgroundDropdown,
  borderPrimary,
  networkColor,
  networkColorSecondary,
  shadowColorSecondary,
  textSecondary,
} from 'theme';

export const ItemWrapper = styled(motion.div)`
  padding: 0.5rem;
  width: 100%;

  > .inner {
    padding: 0 0.75rem;
    flex: 1;
    background: ${backgroundDropdown};
    box-shadow: 0px 1.75px 0px 1.25px ${shadowColorSecondary};
    border-radius: 0.2rem;
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
        padding: 1rem 0 0.75rem 0;
      }

      &:last-child {
        padding-top: 0rem;
        border-top: 1px solid ${borderPrimary};

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
