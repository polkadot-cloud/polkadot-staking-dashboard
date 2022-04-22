// Copyright 2022 @rossbulat/polkadot-staking-experience authors & contributors
// SPDX-License-Identifier: Apache-2.0

import styled from 'styled-components';
import { motion } from 'framer-motion';
import { textPrimary, textSecondary, borderSecondary } from '../../theme';

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

    .identicon {
      margin: 0.15rem 0.25rem 0 0;
    }

    .label {
      color: ${textSecondary};
      font-size: 0.8em;
      font-variation-settings: 'wght' 535;
      display: flex;
      flex-flow: row wrap;
      align-items: center;
      margin: 0 0.5rem;
      padding: 0 0.5rem;
      border-right: 1px solid ${borderSecondary};
    }
    
    .title {
      margin-left: 0.25rem;
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
        color: ${textSecondary};
      }
    }

    .wallet {
      width: 1em;
      height: 1em;
      margin-left: 0.8rem;
      opacity: 0.8;
    }
`;

export default Wrapper;