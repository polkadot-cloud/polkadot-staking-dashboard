// Copyright 2022 @rossbulat/polkadot-staking-experience authors & contributors
// SPDX-License-Identifier: Apache-2.0

import styled from 'styled-components';
import { motion } from 'framer-motion';

export const Wrapper = styled(motion.button)`
    flex: 1;  
    padding: 0rem 0.35rem;
    margin: 0.25rem 0;
    border-radius: 1rem;
    border: 2px solid rgb(220,220,220,1);
    box-shadow: none;
    display: flex;
    flex-flow: row nowrap;
    justify-content: flex-start;
    align-items: center;
    cursor: pointer;
    font-variation-settings: 'wght' 540;
    height: 2.3rem;
    font-size: 0.88rem;
    position: relative;
    transition: width 0.2s;

    .title {
      margin: 0 0.75rem 0 0;
    }

    .label {
      background: rgba(220,220,220,0.75);
      border-radius: 0.75rem;
      color: #333;
      font-size: 0.82rem;
      font-variation-settings: 'wght' 535;
      display: flex;
      flex-flow: row wrap;
      align-items: center;
      padding: 0.2rem 0.75rem;
    }

  > div:first-child {
    padding: 0.15rem 0.6rem;
  }
`;

export default Wrapper;