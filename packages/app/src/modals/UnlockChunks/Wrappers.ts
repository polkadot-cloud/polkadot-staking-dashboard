// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import styled from 'styled-components'

export const ContentWrapper = styled.div`
  display: flex;
  flex-flow: column nowrap;
  border-radius: 1rem;
  width: 100%;

  > div:last-child {
    margin-bottom: 0;
  }
`

export const ChunkWrapper = styled.div`
  flex: 1;
  display: flex;
  flex-flow: column wrap;
  margin-top: 1.25rem;

  > div {
    background: var(--btn-bg);
    display: flex;
    flex-flow: column nowrap;
    width: 100%;
    padding: 0.75rem 1rem;
    border-radius: 1rem;

    > .chunk-header {
      display: flex;
      flex-flow: row wrap;
      align-items: center;
      justify-content: space-between;
      width: 100%;
    }
  }

  h2 {
    margin: 0;
  }

  h4 {
    color: var(--text-secondary);
    margin: 0.5rem 0 0 0;
  }
`
