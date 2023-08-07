// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { motion } from 'framer-motion';
import styled from 'styled-components';

export const CanvasWrapper = styled(motion.div)`
  width: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;

  > div {
    width: inherit;
  }

  .header {
    display: flex;
    flex-direction: column;
    width: 100%;

    > div {
      margin-bottom: 1.75rem;
    }
  }
`;

export const CanvasCardWrapper = styled(motion.div)`
  background: var(--background-floating-card);
  border-radius: 1.5rem;
  display: flex;
  flex-flow: row wrap;
  align-items: center;
  position: relative;
  overflow: hidden;
  margin-bottom: 1.25rem;
  padding: 1rem;
  width: 100%;

  h2 {
    color: var(--text-color-primary);
    padding: 0 0.75rem;
    margin: 0.5rem 0;
    width: 100%;
  }
`;
