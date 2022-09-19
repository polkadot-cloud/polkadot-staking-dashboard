// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import styled from 'styled-components';
import { motion } from 'framer-motion';
import { modalOverlayBackground } from 'theme';

// Blurred background modal wrapper
export const Wrapper = styled(motion.div)`
  background: ${modalOverlayBackground};
  position: fixed;
  width: 100%;
  height: 100%;
  z-index: 9;
  backdrop-filter: blur(9px);

  > div {
    box-sizing: border-box;
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

export const HeightWrapper = styled.div`
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  max-width: 800px;
  z-index: 9;
  position: relative;
  overflow: scroll;
`;

export const ContentWrapper = styled.div`
  box-sizing: border-box;
  width: 100%;
  height: auto;
  overflow: hidden;
  position: relative;
  padding: 4rem 0;
`;
