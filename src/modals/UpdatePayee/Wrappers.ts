// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import styled from 'styled-components';
import { borderPrimary, textSecondary } from 'theme';

export const HeaderWrapper = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  margin-bottom: 1rem;

  > span {
    margin: 0 0.75rem;
    color: ${textSecondary};
    opacity: 0.5;
  }

  /* input element of dropdown */
  > div {
    border-bottom: 1px solid ${borderPrimary};
    display: flex;
    justify-content: center;
    flex: 1;

    > h4 {
      margin: 0;
      padding: 0.6rem 1rem;
    }
  }
`;
