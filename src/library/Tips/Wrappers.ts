// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { motion } from 'framer-motion';
import styled from 'styled-components';
import { helpButton, textPrimary, textSecondary } from 'theme';

export const TipWrapper = styled(motion.div)`
  background: ${helpButton};
  width: 100%;
  display: flex;
  border-radius: 1.5rem;
  margin-bottom: 1.25rem;
  padding: 2rem 2rem 1rem 2rem;
  flex-flow: column wrap;
  align-items: flex-start;
  position: relative;
  overflow: hidden;
  flex: 1;

  h2 {
    margin: 0 0 1.5rem 0;
    display: flex;
    flex-flow: row wrap;
    align-items: center;
    > span {
      color: ${textSecondary};
      margin-left: 0.75rem;
      opacity: 0.75;
      font-size: 1.1rem;
    }
  }

  h4 {
    margin-top: 0;
  }

  p {
    color: ${textPrimary};
    margin: 0.5rem 0 0 0;
    text-align: left;
  }

  p.icon {
    opacity: 0.5;
  }

  .buttons {
    padding-bottom: 1rem;
    > div {
      margin-right: 1rem;
    }
  }
`;
