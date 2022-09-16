// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import styled from 'styled-components';
import { textPrimary } from 'theme';

export const Wrapper = styled.div`
  display: flex;
  flex-flow: column wrap;
  align-items: flex-start;
  justify-content: flex-start;
  padding: 0.5rem;

  h2 {
    margin-top: 0.5rem;
    margin-bottom: 0;
    color: ${textPrimary};
  }

  h3 {
    margin-bottom: 0.5rem;
  }

  h4 {
    margin: 0;
  }
`;
