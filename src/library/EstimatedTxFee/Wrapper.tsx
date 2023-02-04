// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import styled from 'styled-components';
import { textSecondary } from 'theme';

export const Wrapper = styled.div`
  p {
    padding: 0;
    font-size: 1rem;
    color: ${textSecondary};
    margin: 0.5rem 0;

    > span {
      margin: 0 0.5rem 0 0;
    }
  }
`;
