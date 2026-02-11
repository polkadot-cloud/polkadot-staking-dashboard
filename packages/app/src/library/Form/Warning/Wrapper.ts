// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import styled from 'styled-components'

export const Wrapper = styled.div`
  background: var(--btn-bg);
  border: 1px solid var(--status-warning);
  margin: 0.5rem 0;
  padding: 0.6rem 0.9rem;
  border-radius: 0.75rem;
  display: flex;
  flex-flow: row wrap;
  align-items: center;
  width: 100%;

  > h4 {
    color: var(--status-warning);
    font-family: Inter, sans-serif;

    .icon {
      color: var(--status-warning);
      margin-right: 0.5rem;
    }
  }
`
