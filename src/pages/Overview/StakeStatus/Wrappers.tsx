// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import styled from 'styled-components';
import { borderPrimary } from 'theme';

export const StatusWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-flow: column nowrap;
  margin-top: 0.25rem;
  position: relative;
  top: -0.1rem;
  > div {
    &:last-child {
      margin-bottom: 0;
    }
  }
`;

export const StatusRowWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  border-bottom: 1px solid ${borderPrimary};
  padding-bottom: 0.75rem;
  margin-bottom: 0.75rem;
  > div {
    display: flex;
    flex-flow: row nowrap;
    align-items: center;
    first-child {
      flex-grow: 1;
    }
  }

  button {
    border: none;
  }

  h3 {
    margin: 0 1rem 0 0;
  }
`;
