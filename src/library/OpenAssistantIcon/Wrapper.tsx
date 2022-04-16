// Copyright 2022 @rossbulat/polkadot-staking-experience authors & contributors
// SPDX-License-Identifier: Apache-2.0

import styled from 'styled-components';
import { textSecondary, primary } from '../../theme';

export const Wrapper = styled.button`
  color: ${textSecondary};
  display: flex;
  flex-flow: row wrap;
  align-items: center;
  opacity: 0.6;
  &:hover {
    color: ${primary};
    opacity: 1;
  }
`;

export default Wrapper;