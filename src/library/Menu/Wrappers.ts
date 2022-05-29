// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FLOATING_MENU_WIDTH } from '../../constants';
import { backgroundPrimary, borderPrimary } from '../../theme';

export const Wrapper = styled.div<any>`
  background: ${backgroundPrimary};
  border: 1px solid ${borderPrimary};
  box-sizing: border-box;
  border-radius: 0.5rem;
  width: ${FLOATING_MENU_WIDTH}px;
  padding: 1rem;
`;
