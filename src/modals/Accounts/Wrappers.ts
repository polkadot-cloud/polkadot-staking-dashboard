// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { motion } from 'framer-motion';
import styled from 'styled-components';

export const CardsWrapper = styled(motion.div)`
  width: 200%;
  display: flex;
  overflow: hidden;
  position: relative;
`;

export const AccountWrapper = styled.div`
  width: 100%;
  margin: 0.5rem 0 0 0;
  transition: transform var(--transition-duration);

  &:hover {
    transform: scale(1.006);
    .name {
      color: var(--network-color-primary);
    }
  }

  > div,
  button {
    background: var(--button-primary-background);
    color: var(--text-color-primary);
    width: 100%;
    border-radius: 0.75rem;
    font-size: 1rem;
    display: flex;
    align-items: center;
    min-height: 3.5rem;
    padding-left: 0.4rem;
    padding-right: 0.4rem;

    > div {
      display: flex;
      align-items: center;
      padding: 0 0.25rem;

      &.label {
        font-size: 0.85rem;
        display: flex;
        flex-flow: row wrap;
        align-items: flex-end;
      }

      &:first-child {
        flex-shrink: 1;
        overflow: hidden;
        .name {
          max-width: 100%;
          text-overflow: ellipsis;
          white-space: nowrap;
          overflow: hidden;
          transition: color var(--transition-duration);
        }
      }

      &:last-child {
        flex-grow: 1;
        justify-content: flex-end;
      }

      &.neutral {
        h5 {
          color: var(--text-color-secondary);
          opacity: 0.75;
        }
      }
      &.danger {
        h5 {
          color: var(--status-danger-color);
        }
      }
      .icon {
        width: 1.05rem;
        height: 1.05rem;
        margin-left: 0.75rem;
      }

      /* svg theming */
      svg {
        .light {
          fill: var(--text-color-invert);
        }
        .dark {
          fill: var(--text-color-secondary);
        }
      }
    }
  }
`;

export const AccountSeparator = styled.div`
  width: 100%;
  height: 0.5rem;
`;
