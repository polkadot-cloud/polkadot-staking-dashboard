// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import styled from 'styled-components';
import {
  buttonHelpBackground,
  buttonPrimaryBackground,
  networkColor,
  textSecondary,
} from 'theme';

export const Wrapper = styled.button<{ light?: boolean }>`
  background: ${(props) =>
    props.light ? buttonPrimaryBackground : buttonHelpBackground};
  color: ${textSecondary};
  fill: ${textSecondary};
  display: flex;
  flex-flow: row wrap;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  padding: 0.05rem;
  transition: all 0.15s;
  font-size: 1.15rem;

  &:hover {
    fill: ${networkColor};
  }
`;

export default Wrapper;
