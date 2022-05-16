// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import styled from 'styled-components';
import { motion } from 'framer-motion';
import { textPrimary, textSecondary, borderSecondary } from '../../theme';

export const Wrapper = styled(motion.button) <any>`
    border-radius: 1rem;
    box-shadow: none;
    display: flex;
    flex-flow: row wrap;
    justify-content: flex-start;
    align-items: center;
    font-variation-settings: 'wght' 540;
    cursor: ${props => props.cursor};
    background: ${props => props.fill};
    font-size: ${props => props.fontSize};
    padding: 0 1rem;
    flex: 1;

    .identicon {
      margin: 0.15rem 0.25rem 0 0;
    }

    .account-label {
      color: ${textSecondary};
      font-size: 0.8em;
      font-variation-settings: 'wght' 535;
      display: flex;
      flex-flow: row wrap;
      align-items: center;
      justify-content: flex-end;
      margin-right: 0.5rem;
      padding-right: 0.5rem;
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
      
      path {
        fill: ${textPrimary};
      }
    }
`;

export default Wrapper;