// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { SECTION_FULL_WIDTH_THRESHOLD } from 'consts';
import styled from 'styled-components';

export const GenerateOptionsWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-flow: row wrap;
  margin-top: 1rem;

  .item {
    flex-basis: 33%;
    @media (max-width: ${SECTION_FULL_WIDTH_THRESHOLD}px) {
      flex-basis: 100%;
    }
  }
`;
