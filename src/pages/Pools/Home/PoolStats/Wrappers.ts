// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

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
      color: var(--accent-color-primary);
    }
    &.danger {
      color: #d2545d;
    }
    &.warning {
      color: #b5a200;
    }
    &.pools {
      color: var(--accent-color-secondary);
    }
  }

  p {
    color: var(--text-color-secondary);
    margin: 0;
    line-height: 1.2rem;
  }
`;
