// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import styled from 'styled-components';
import { motion } from 'framer-motion';
import { assistantBackground } from 'theme';
import {
  MAX_SIDE_BAR_INTERFACE_WIDTH,
  SHOW_SIDE_BAR_WIDTH_THRESHOLD,
} from 'consts';

export const Wrapper = styled(motion.div)`
  position: fixed;
  right: -600px;
  top: 0;
  width: 100%;
  max-width: ${MAX_SIDE_BAR_INTERFACE_WIDTH}px;
  height: auto;
  max-height: 100%;
  z-index: 8;
  display: flex;
  flex-flow: column nowrap;
  overflow: hidden;
  box-sizing: border-box;
  * {
    box-sizing: border-box;
  }
`;

export const ContentWrapper = styled.div`
  background: ${assistantBackground};
  backdrop-filter: blur(4px);
  border-radius: 1rem;
  display: flex;
  flex-flow: column nowrap;
  flex-basis: 100%;
  margin: 0.85rem;
  overflow: hidden;
  max-height: 100%;

  > div {
    margin: 0.5rem;
    flex-grow: 1;
  }

  .account-label {
    min-width: 70px;
  }
`;

export const ToggleWrapper = styled.div`
  display: flex;
  margin-left: 1rem;

  @media (min-width: ${SHOW_SIDE_BAR_WIDTH_THRESHOLD + 1}px) {
    display: none;
  }
`;
