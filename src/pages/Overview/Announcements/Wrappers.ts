// Copyright 2022 @rossbulat/polkadot-staking-experience authors & contributors
// SPDX-License-Identifier: Apache-2.0

import styled from 'styled-components';
import { motion } from 'framer-motion';

export const Wrapper = styled.div`
  flex: 1;
  display: flex;
  flex-flow: column wrap;
  width: 100%;
  h3 {
    margin-bottom: 0;
  }
`;
export const Item = styled(motion.div)`
  list-style: none;
  flex: 1;
  flex-flow: row nowrap;
  justify-content: flex-start;
  align-items: flex-start;
  margin: 1rem 0.25rem;
  padding: 1rem 0rem;
  border-bottom: 2px solid #f1f1f1;
  /* background: linear-gradient(90deg, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0.25) 100%); */


  h5 {
    margin: 0 0 0.75rem;;
    font-variation-settings: 'wght' 500;

    &.danger {
      color: #d2545d;
    }
    &.warning {
      color: #b5a200;
    }
  }

  p {
    margin: 0;
    color: #333;
    font-size: 0.9rem;
    line-height: 1.2rem;
    font-variation-settings: 'wght' 500;
  }
`;