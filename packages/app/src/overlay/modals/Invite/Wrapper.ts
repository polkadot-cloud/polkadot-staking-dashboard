// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import styled from 'styled-components'

export const Wrapper = styled.div`
  padding: 0 1.75rem 1rem 1.75rem;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;

  > svg {
    width: 100%;
    height: auto;
    max-width: 7rem;
    margin-bottom: 3rem;
  }

  button {
    text-align: center;
    &:hover {
      color: var(--accent-color-primary);
    }
  }
`
