// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import styled from 'styled-components';
import { motion } from 'framer-motion';
import { textSecondary, borderPrimary } from '../../../theme';

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
  padding: 1rem;
  border-bottom: 1px solid ${borderPrimary};

  h3 {
    display: flex;
    flex-flow: row wrap;
    align-items: center;
    margin: 0 0 0.8rem;;
    padding: 0.2rem 0;

    &.neutral {
      color: #d33079;
    }
    &.danger {
      color: #d2545d;
    }
    &.warning {
      color: #b5a200;
    }
  }

  p {
    margin: 0;
    color: ${textSecondary};
    font-size: 0.9rem;
    line-height: 1.2rem;
    font-variation-settings: 'wght' 490;
  }
`;
