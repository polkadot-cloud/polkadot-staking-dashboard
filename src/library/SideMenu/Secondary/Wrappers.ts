// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { motion } from 'framer-motion';
import styled from 'styled-components';
import type { MinimisedProps } from '../types';

export const Wrapper = styled(motion.button)<MinimisedProps>`
  border: 1px solid var(--border-primary-color);
  border-radius: 0.7rem;
  height: 3.2rem;
  display: flex;
  flex-flow: row wrap;
  align-items: center;
  position: relative;
  padding: 0.75rem 0rem 0.75rem 0.5rem;
  margin: 0.8rem 0.2rem 0.8rem 0;
  width: 100%;

  .name {
    color: var(--text-color-primary);
    font-family: InterSemiBold, sans-serif;
    font-size: 1.1rem;
  }
  .light {
    color: var(--text-color-primary);
    margin-left: 0.2rem;
  }
  .action {
    color: var(--text-color-primary);
    flex: 1;
    display: flex;
    flex-flow: row wrap;
    justify-content: flex-end;
  }

  &.active {
    background: var(--highlight-primary);
  }
  &.inactive:hover {
    background: var(--highlight-secondary);
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
  border-radius: 0.5rem;
  display: flex;
  flex-flow: row wrap;
  justify-content: center;
  align-items: center;
  position: relative;
  padding: 0rem 0rem;
  margin: 0.6rem 0 0.6rem 0;
  min-height: 2.8rem;
  width: 100%;

  &.active {
    background: var(--highlight-primary);
  }
  &.inactive:hover {
    background: var(--highlight-secondary);
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

export const IconWrapper = styled.div<{ $minimised: boolean }>`
  margin-left: ${(props) => (props.$minimised ? 0 : '0.25rem')};
  margin-right: ${(props) => (props.$minimised ? 0 : '0.65rem')};

  svg {
    .primary {
      fill: var(--text-color-primary);
    }
  }
`;
