// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import styled from 'styled-components';
import { textSecondary, primary, buttonAssistantBackground } from '../../theme';

export const Wrapper = styled.button`
  background: ${buttonAssistantBackground};
  color: ${textSecondary};
  fill: ${textSecondary};
  display: flex;
  flex-flow: row wrap;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  padding: 0.05rem;
  transition: all 0.15s;

  &:hover {
    fill: ${primary};
  }
`;

export default Wrapper;