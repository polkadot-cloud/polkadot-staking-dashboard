// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import styled from 'styled-components'

export const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-top: 1.5rem;

  .account-selection {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;

    > h4 {
      margin: 0;
      color: var(--text-color-primary);
    }
  }

  .submit-section {
    display: flex;
    justify-content: flex-end;
    margin-top: 0.5rem;
  }
`
