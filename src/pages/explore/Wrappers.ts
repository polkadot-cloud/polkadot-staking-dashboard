// Copyright 2022 @rossbulat/polkadot-staking-experience authors & contributors
// SPDX-License-Identifier: Apache-2.0

import styled from 'styled-components';
import { motion } from 'framer-motion';

export const Wrapper = styled.div`
  h3 {
    color: #555;
  }
`;
export const ItemsWrapper = styled(motion.div)`
  display: flex;
  flex-flow: row wrap;
  width: 100%;
`;

export const Item = styled(motion.button)`
  width: 200px;
  height: 200px;
  background: rgba(229,229,229,0.25);
  margin: 1rem 2rem 1rem 0;
  border-radius: 0.75rem;
  display: flex;
  flex-flow: column wrap;
  justify-content: center;
  align-items: center;
`;