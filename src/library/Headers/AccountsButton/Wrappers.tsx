// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import styled from 'styled-components';
import { SHOW_ACCOUNTS_BUTTON_WIDTH_THRESHOLD } from 'consts';

export const Wrapper = styled.div`
  display: flex;
  margin-left: 1rem;

  @media (min-width: ${SHOW_ACCOUNTS_BUTTON_WIDTH_THRESHOLD + 1}px) {
    display: none;
  }
`;
