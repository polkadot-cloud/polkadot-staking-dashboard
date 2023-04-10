// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { motion } from 'framer-motion';
import styled from 'styled-components';

export const Wrapper = styled(motion.div)`
  border-radius: 0.7rem;
  display: flex;
  flex-flow: row wrap;
  align-items: center;
  padding: 0rem 0.5rem;
  margin: 0.4rem 0.2rem 0.3rem 0;
  position: relative;
  height: 3.2rem;
  border: none;

  &.minimised {
    border-radius: 0.5rem;
    justify-content: center;
    padding: 0.65rem 0rem;
    margin: 0.7rem 0.2rem 0.5rem 0;
    font-size: 1.1rem;
    border: 1px solid rgba(255, 255, 255, 0);

    &.action-success {
      border: 1px solid var(--network-color-primary);
    }
    &.action-warning {
      border: 1px solid var(--status);
    }
  }

  .dotlottie {
    color: var(--text-color-primary);
    margin-left: 0.25rem;
    margin-right: 0.65rem;
    width: 1.35rem;
    height: 1.35rem;
    .fa-icon {
      margin: 0 0.15rem;
    }
    &.minimised {
      width: 1.5rem;
      height: 1.5rem;
      margin: 0;
    }
  }
  .name {
    margin: 0;
    padding: 0;
    line-height: 1.35rem;
  }
  .action {
    color: var(--status-success-color);
    flex: 1;
    display: flex;
    flex-flow: row wrap;
    justify-content: flex-end;
    margin-right: 0.4rem;
    font-size: 0.88rem;
    opacity: 0.7;

    > span {
      &.success {
        color: var(--network-color-primary);
        border: 1px solid var(--network-color-primary);
      }
      &.warning {
        color: var(--status-warning-color);
        border: 1px solid var(--status-warning-color-transparent);
      }
      border-radius: 0.5rem;
      padding: 0.15rem 0.5rem;
    }

    &.success {
      svg {
        color: var(--status-success-color);
      }
    }
    &.warning {
      svg {
        color: var(--status-warning-color);
      }
    }
    &.minimised {
      > svg {
        flex: 0;
        position: absolute;
        top: -4px;
        right: -3px;
      }
    }
  }

  &.active {
    background: var(--gradient-highlight-primary);
  }
  &.inactive:hover {
    background: var(--gradient-highlight-secondary);
  }
  &.inactive:hover {
    background: var(--gradient-highlight-secondary);
  }
`;
