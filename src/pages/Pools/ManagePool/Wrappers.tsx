// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import styled from 'styled-components';
import { borderPrimary } from '../../../theme';

export const ManageWrapper = styled.div<any>`
  display: flex;
  flex-flow: row wrap;
  width: 100%;

  > div {
    &:first-child {
      margin-right: 1.5rem;
    }
    &:last-child {
      flex: 1;
    }
  }
`;

export const RolesWrapper = styled.div`
  border-right: 1px solid ${borderPrimary};
  flex: 1;
  min-width: 175px;
`;
