// Copyright 2022 @rossbulat/polkadot-staking-experience authors & contributors
// SPDX-License-Identifier: Apache-2.0

import styled from 'styled-components';
import { motion } from 'framer-motion';
import { textPrimary, textSecondary, labelBackground } from '../../theme';

export const Wrapper = styled(motion.button) <any>`
    padding: ${props => props.padding};
    border-radius: 1rem;
    box-shadow: none;
    display: flex;
    flex-flow: row nowrap;
    justify-content: flex-start;
    align-items: center;
    font-variation-settings: 'wght' 540;
    position: relative;
    cursor: ${props => props.cursor};
    background: ${props => props.fill};
    font-size: ${props => props.fontSize};
    width: 100%;
    flex: 1;
    
    .title {
      margin: 0 0.75rem 0 0;
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
      line-height: 2.2rem;
      flex: 1;
      display: flex;
      flex-flow: row wrap;
      justify-content: flex-start;
      color: ${textPrimary};

      &.unassigned {
        margin-left: 1rem;
        color: ${textSecondary};
      }
    }

    .label {
      background: ${labelBackground};
      border-radius: 0.75rem;
      color: ${textPrimary};
      font-size: 0.8em;
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