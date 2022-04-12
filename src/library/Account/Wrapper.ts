// Copyright 2022 @rossbulat/polkadot-staking-experience authors & contributors
// SPDX-License-Identifier: Apache-2.0

import styled from 'styled-components';
import { motion } from 'framer-motion';

export const Wrapper = styled(motion.button) <any>`
    flex-grow: 1;  
    padding: 0 0.35rem;
    border-radius: 1rem;
    box-shadow: none;
    display: flex;
    flex-flow: row nowrap;
    justify-content: flex-start;
    align-items: center;
    font-variation-settings: 'wght' 540;
    position: relative;
    transition: width 0.2s;
    cursor: ${props => props.cursor};
    background: ${props => props.fill};
    font-size: 1rem;
  
    .title {
      margin: 0 0.75rem 0 0;
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
      line-height: 2.2rem;

      &.unassigned {
        margin-left: 1rem;
        color: #666;
      }
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