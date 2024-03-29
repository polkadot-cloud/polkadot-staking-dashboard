// Copyright 2024 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import styled from 'styled-components';

export const JoinPoolInterfaceWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 4rem;
  width: 100%;

  > .header {
    display: flex;
    margin-bottom: 2rem;
  }

  > .content {
    display: flex;
    flex: 1;

    > div {
      display: flex;

      &:first-child {
        flex-grow: 1;
      }

      &:last-child {
        min-width: 300px;
      }
    }
  }
`;
