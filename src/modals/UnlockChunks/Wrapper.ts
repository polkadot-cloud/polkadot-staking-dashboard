// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import styled from 'styled-components';
import { textSecondary } from '../../theme';

export const Wrapper = styled.div`
  box-sizing: border-box;
  display: flex;
  flex-flow: column wrap;
  align-items: flex-start;
  justify-content: flex-start;
  padding: 1rem 0;
`;

export const ChunkWrapper = styled.div`
  flex: 1;
  display: flex;
  flex-flow: column wrap;
  margin: 1rem 0;

  h3 {
    color: ${textSecondary};
    margin: 0;
  }

  h2 {
    margin: 0.75rem 0;
  }
`;

export default Wrapper;
