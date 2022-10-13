// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import styled from 'styled-components';
import { backgroundLabel } from 'theme';

export const Spacer = styled.div`
  width: 100%;
  height: 1px;
  margin: 0.75rem 0;
`;

export const RowWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-flow: row wrap;
  align-items: flex-end;

  > div:last-child {
    height: 100%;
    flex-grow: 1;
    display: flex;
    flex-flow: row wrap;
    align-items: flex-end;
    padding: 0.5rem 1rem;
  }
`;

export const InputWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-flow: row wrap;

  > section {
    flex: 1;

    h3 {
      margin: 0;
    }

    input {
      background: ${backgroundLabel};
      max-width: 100%;
      margin-top: 0.5rem;
      border: none;
      border-radius: 0.75rem;
      padding: 0.75rem;
    }
  }
`;
