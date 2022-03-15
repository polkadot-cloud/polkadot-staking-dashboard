// Copyright 2022 @rossbulat/polkadot-staking-experience authors & contributors
// SPDX-License-Identifier: Apache-2.0

import styled from 'styled-components';
import { motion } from 'framer-motion';

export const Wrapper = styled(motion.div)`
  flex-grow: 1;
  padding: 0.5rem;
  
  > div {
    padding: 0.75rem;
    flex-grow: 1;
    background: linear-gradient(90deg, rgba(242,242,242,1) 0%, rgba(242,242,242,0.6) 100%);
    border-radius: 0.75rem;
    display: flex;
    flex-flow: row nowrap;
    justify-content: flex-start;
    align-items: center;

    h4 {
      margin-top: 0;
    }

    .right {
      display: flex;
      margin-left: 0.75rem;
      flex-grow: 1;
      display: flex;
      flex-flow: row wrap;
      align-items: center;
      align-content: center;
    }
  }
`;

export default Wrapper;