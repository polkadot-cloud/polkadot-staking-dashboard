// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import styled from 'styled-components';

export const Wrapper = styled.div`
  background: var(--background-warning-color);
  border: 1px solid var(--status-warning-color-transparent);
  margin: 0.5rem 0;
  padding: 0.75rem 0.75rem;
  border-radius: 0.75rem;
  display: flex;
  flex-flow: row wrap;
  align-items: center;
  width: 100%;

  > h4 {
    color: var(--status-warning-color);
    margin: 0;

    .icon {
      color: var(--status-warning-color);
      margin-right: 0.6rem;
    }
  }
`;
