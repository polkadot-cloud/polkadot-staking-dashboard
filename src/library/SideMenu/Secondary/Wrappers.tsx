// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { motion } from 'framer-motion';
import styled from 'styled-components';
import type { MinimisedProps } from '../types';

export const Wrapper = styled(motion.button)<MinimisedProps>`
  width: 100%;
  border: 1px solid var(--border-primary-color);
  border-radius: 0.7rem;
  display: flex;
  flex-flow: row wrap;
  align-items: center;
  padding: 0.75rem 0rem 0.75rem 0.5rem;
  margin: 0.8rem 0.2rem 0.8rem 0;
  position: relative;
  height: 3.2rem;
  .name {
    color: var(--text-color-secondary);
    font-size: 1.1rem;
  }
  .light {
    color: var(--text-color-secondary);
    margin-left: 0.2rem;
  }
  .action {
    color: var(--text-color-secondary);
    flex: 1;
    display: flex;
    flex-flow: row wrap;
    justify-content: flex-end;
  }

  &.active {
    background: var(--gradient-highlight-primary);
  }
  &.inactive:hover {
    background: var(--gradient-highlight-secondary);
  }
  &.success {
    border: 1px solid var(--status-success-color-transparent);
  }
  &.warning {
    border: 1px solid var(--status-warning-color-transparent);
  }
  &.danger {
    border: 1px solid var(--status-danger-color-transparent);
  }
`;

export const MinimisedWrapper = styled(motion.button)`
  border: 1px solid var(--border-primary-color);
  width: 100%;
  border-radius: 0.5rem;
  display: flex;
  flex-flow: row wrap;
  justify-content: center;
  align-items: center;
  padding: 0rem 0rem;
  margin: 0.6rem 0 0.6rem 0;
  position: relative;
  min-height: 2.8rem;

  &.active {
    background: var(--gradient-highlight-primary);
  }
  &.inactive:hover {
    background: var(--gradient-highlight-secondary);
  }
  .icon {
    margin: 0;
  }
  .action {
    &.minimised {
      flex: 0;
      position: absolute;
      top: -2px;
      right: -13px;
    }
  }
  &.success {
    border: 1px solid var(--status-success-color-transparent);
  }
  &.warning {
    border: 1px solid var(--status-warning-color-transparent);
  }
  &.danger {
    border: 1px solid var(--status-danger-color-transparent);
  }
`;

export const IconWrapper = styled.div<{ minimised: number }>`
  margin-left: ${(props) => (props.minimised ? 0 : '0.25rem')};
  margin-right: ${(props) => (props.minimised ? 0 : '0.65rem')};

  svg {
    .primary {
      fill: var(--text-color-secondary);
    }
  }
`;
