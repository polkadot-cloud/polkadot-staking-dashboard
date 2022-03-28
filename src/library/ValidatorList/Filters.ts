// Copyright 2022 @rossbulat/polkadot-staking-experience authors & contributors
// SPDX-License-Identifier: Apache-2.0

import styled from 'styled-components';
import { motion } from 'framer-motion';

export const FiltersWrapper = styled.div`
  width: 100%;
  padding: 0.5rem;
`;

export const Item = styled(motion.button)`
    width: 110px;
    height: 80px;
    border-radius: 0.75rem;
    /* background: rgba(211, 48, 121, 0.85); */
    background: #f1f1f1;
    display: flex;
    flex-flow: column nowrap;

    > div {
      display: flex;
      flex-flow: row wrap;
      padding-left: 0.5rem;
      padding-right: 0.5rem;
      width: 100%;

      &:first-child { 
        flex-grow: 1;
        flex-basis: 70%;
        justify-content: flex-start;
        align-items: flex-end;
        padding-bottom: 0.6rem;
        
        .icon {
          display: flex;
          flex-flow: column wrap;
          justify-content: center;
          align-items: center;
          padding: 0 0.5rem;
        }
      }

      &:last-child {
      justify-content: flex-start;
      padding-top: 0.2rem;
      flex-basis: 30%;
      p {
        color: #999;
        font-size: 0.85rem;
        margin: 0;
        text-align: left;
        font-variation-settings: 'wght' 500;
        padding-bottom: 0.5rem;
      }
    }
  }   
`;

export default FiltersWrapper;