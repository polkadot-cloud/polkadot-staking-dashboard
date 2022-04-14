// Copyright 2022 @rossbulat/polkadot-staking-experience authors & contributors
// SPDX-License-Identifier: Apache-2.0

import styled from 'styled-components';
import { motion } from 'framer-motion';

// Blurred background modal wrapper
export const Wrapper = styled(motion.div)`
    position: fixed;
    width: 100%;
    height: 100%;
    z-index: 9;
    backdrop-filter: blur(4px);
    background: rgba(240,240,240, 0.6);
    /* background: rgba(211,48,121, 0.6); Polkadot themed background */

    /* modal content wrapper */
    .content_wrapper {
      height: 100%;
      display: flex;
      flex-flow: row wrap;
      justify-content: center;
      align-items: center;
      padding: 1rem 2rem;

      /* click anywhere behind modal content to close */
      .close {
          position: fixed;
          width: 100%;
          height: 100%;
          z-index: 8;
          cursor: default;
      }
    }
`;

export const ContentWrapper = styled.div<any>`
  width: 100%;
  max-width: ${props => props.size === 'large' ? '800px' : '600px'};
  background: white;
  z-index: 9;
  border-radius: 0.75rem;
  overflow: hidden;
  overflow-y: scroll;
  position: relative;
  
  .header {
    width: 100%;
    display: flex;
    flex-flow: row wrap;
    align-items: center;
    padding: 1rem 1rem 0 1rem;
  }
  .body {
    padding: 1rem;
  }
`;

export default Wrapper;