// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import styled from 'styled-components';
import { motion } from 'framer-motion';
import {
  textSecondary,
  borderPrimary,
  networkColor,
  networkColorSecondary,
} from 'theme';
import { SMALL_FONT_SIZE_MAX_WIDTH } from 'consts';

export const Wrapper = styled.div`
  flex: 1;
  display: flex;
  flex-flow: column wrap;
  width: 100%;
`;

export const Item = styled(motion.div)`
  list-style: none;
  flex: 1;
  flex-flow: row nowrap;
  justify-content: flex-start;
  align-items: flex-start;
  margin-bottom: 1rem;
  padding: 0.75rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid ${borderPrimary};

  &:last-child {
    border-bottom: 0;
    margin-bottom: 0;
  }

  h4 {
    display: flex;
    flex-flow: row wrap;
    align-items: center;
    margin: 0 0 0.5rem;
    padding-bottom: 0.2rem;

    &.neutral {
      color: ${networkColor};
    }
    &.danger {
      color: #d2545d;
    }
    &.warning {
      color: #b5a200;
    }
    &.pools {
      color: ${networkColorSecondary};
    }
  }

  p {
    margin: 0;
    color: ${textSecondary};
    line-height: 1.2rem;
  }
`;

export const HeaderWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-flow: row wrap;
  align-items: center;
  margin-bottom: 0.75rem;

  h4 {
    .help-icon {
      margin-left: 0.6rem;
    }
  }

  > section {
    display: flex;
    flex-flow: column wrap;
    justify-content: center;
    flex-basis: 100%;

    .items {
      box-sizing: border-box;
      flex-grow: 1;
      display: flex;
      flex-flow: row wrap;
      align-items: center;
      width: 100%;

      > div {
        box-sizing: border-box;
        flex-grow: 1;
        flex-basis: 100%;
        width: 100%;
        margin-bottom: 0.5rem;
        border-right: 0;

        &:last-child {
          border-right: 0;
        }

        @media (min-width: ${SMALL_FONT_SIZE_MAX_WIDTH + 150}px) {
          flex-basis: 25%;
          max-width: 275px;
          padding-left: 1rem;
          padding-right: 1rem;
          margin-bottom: 0;
          border-right: 1px solid ${borderPrimary};

          &:last-child {
            max-width: none;
          }
        }

        > .inner {
          width: 100%;
          padding: 0.5rem 0.5rem 1rem 0.5rem;
          display: flex;
          flex-flow: row nowrap;
          border-bottom: 1px solid ${borderPrimary};

          @media (min-width: ${SMALL_FONT_SIZE_MAX_WIDTH + 150}px) {
            margin-bottom: 0;
          }

          h2 {
            color: ${networkColor};
            margin-top: 0rem;
            margin-bottom: 0;
          }
          h4 {
            display: flex;
            flex-flow: row wrap;
            color: ${textSecondary};
            margin-top: 0.45rem;
            margin-bottom: 0;
          }
          display: flex;
          flex-flow: column wrap;
        }

        &:first-child {
          padding-left: 0;
        }
        &:last-child {
          padding-right: 0;
        }
      }
    }
  }
`;
