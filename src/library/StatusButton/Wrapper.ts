// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import styled from 'styled-components';
import { buttonPrimaryBackground, textPrimary, textSecondary } from 'theme';

export const Wrapper = styled.button`
  width: 100%;
  flex: 1;
  padding: 1rem 0.75rem;
  border-radius: 0.75rem;
  margin-bottom: 1rem;
  font-size: 1rem;
  display: flex;
  flex-flow: row-reverse wrap;
  align-items: center;
  background: ${buttonPrimaryBackground};
  transition: all 0.15s;
  color: ${textPrimary};

  > section:last-child {
    color: ${textSecondary};
    padding-left: 0.25rem;
    display: flex;
    flex-flow: row wrap;
    justify-content: flex-start;
    flex: 1;
  }

  &:hover {
    > section {
      color: ${textPrimary};
    }
  }
`;

export default Wrapper;
