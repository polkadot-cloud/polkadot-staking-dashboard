// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { SmallFontSizeMaxWidth } from 'consts';
import { motion } from 'framer-motion';
import styled from 'styled-components';

export const Wrapper = styled.div`
  flex: 1;
  display: flex;
  flex-flow: column wrap;
  width: 100%;
`;

export const Item = styled(motion.div)`
  border-bottom: 1px solid var(--border-primary-color);
  list-style: none;
  flex: 1;
  margin-bottom: 1rem;
  padding: 0.75rem;
  padding-bottom: 1.5rem;

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
      color: var(--network-color-primary);
    }
    &.danger {
      color: #d2545d;
    }
    &.warning {
      color: #b5a200;
    }
    &.pools {
      color: var(--network-color-secondary);
    }
  }

  p {
    color: var(--text-color-secondary);
    margin: 0;
    line-height: 1.2rem;
  }
`;

export const HeaderWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-flow: row wrap;
  align-items: center;
  margin-bottom: 0.75rem;

  > section {
    display: flex;
    flex-flow: column wrap;
    justify-content: center;
    flex-basis: 100%;

    .items {
      flex-grow: 1;
      display: flex;
      flex-flow: row wrap;
      align-items: center;
      width: 100%;

      > div {
        flex-grow: 1;
        flex-basis: 100%;
        width: 100%;
        margin-bottom: 0.5rem;
        border-right: 0;

        &:last-child {
          border-right: 0;
        }

        @media (min-width: ${SmallFontSizeMaxWidth + 150}px) {
          border-right: 1px solid var(--border-primary-color);
          flex-basis: 25%;
          max-width: 275px;
          padding-left: 1rem;
          padding-right: 1rem;
          margin-bottom: 0;

          &:last-child {
            max-width: none;
          }
        }

        > .inner {
          border-bottom: 1px solid var(--border-primary-color);
          width: 100%;
          padding: 0.5rem 0.5rem 1rem 0.5rem;
          display: flex;

          @media (min-width: ${SmallFontSizeMaxWidth + 150}px) {
            margin-bottom: 0;
          }

          h2 {
            color: var(--network-color-primary);
          }
          h4 {
            color: var(--text-color-secondary);
            display: flex;
            flex-flow: row wrap;
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
