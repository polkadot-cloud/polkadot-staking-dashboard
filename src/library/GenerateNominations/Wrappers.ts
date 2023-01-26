// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { SectionFullWidthThreshold } from 'consts';
import styled from 'styled-components';

export const GenerateOptionsWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-flow: row wrap;
  margin-top: 1rem;

  .item {
    flex-basis: 50%;
    @media (max-width: ${SectionFullWidthThreshold}px) {
      flex-basis: 100%;
    }
  }
`;
