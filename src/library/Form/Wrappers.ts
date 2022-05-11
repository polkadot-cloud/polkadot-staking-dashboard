// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import styled from "styled-components";
import { backgroundLabel } from '../../theme';

export const Warning = styled.div`
background: ${backgroundLabel};
margin: 0.6rem 0;
padding: 0.5rem 0.75rem;
color: rgba(255, 144, 0, 1);
border-radius: 0.75rem;
display: flex;
flex-flow: row wrap;
align-items: center;

h4 {
  margin: 0 0 0 0.75rem;
}
`;

export const Spacer = styled.div`
  width: 100%;
  height: 1px;
  margin: 0.75rem 0;
`;