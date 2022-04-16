// Copyright 2022 @rossbulat/polkadot-staking-experience authors & contributors
// SPDX-License-Identifier: Apache-2.0

import styled from 'styled-components';
import { textSecondary, borderPrimary } from '../../../theme';

export const StyledHeader = styled.div`
  border-bottom: 1px solid ${borderPrimary};
  width: 100%;
  padding-bottom: 0.5rem;
  display: flex;
  flex-flow: row nowrap;
  align-items: flex-end;

   > div:last-child {
     flex: 1;
     display: flex;
     justify-content: flex-end;
     font-size: 1.2rem;
     color: ${textSecondary};
   }
`;

export default StyledHeader;