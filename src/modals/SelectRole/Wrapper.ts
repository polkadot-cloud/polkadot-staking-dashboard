// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import styled from 'styled-components';
import {
  backgroundToggle,
  buttonDisabledBackground,
  buttonDisabledText,
  buttonPrimaryBackground,
  successTransparent,
  textSuccess,
} from 'theme';

export const ContentWrapper = styled.div`
  box-sizing: border-box;
  width: 100%;
`;

export const RoleButton = styled.button<any>`
  background: ${buttonPrimaryBackground};
  box-sizing: border-box;
  padding: 1rem;
  cursor: pointer;
  border-radius: 0.75rem;
  display: inline-flex;
  flex-flow: row wrap;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  border: 1px solid ${successTransparent};
  ${(props) =>
    props.connected !== true &&
    `
  border: 1px solid rgba(0,0,0,0);
`}
  h4 {
    margin: 0;
    &.selected {
      color: ${textSuccess};
      margin-left: 0.75rem;
    }
  }
  &:hover {
    background: ${backgroundToggle};
  }
  &:disabled {
    background: ${buttonDisabledBackground};
    color: ${buttonDisabledText};
  }
`;
