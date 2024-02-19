// Copyright 2024 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { MaxPageWidth } from 'consts';
import styled from 'styled-components';

export const PageWrapper = styled.div`
  max-width: ${MaxPageWidth}px;
  display: flex;
  flex-direction: column;
  padding-bottom: 4.5rem;
  width: 100%;
  margin: 0 auto;
`;
