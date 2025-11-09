// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import styled from 'styled-components'

export const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-top: 1.5rem;
  padding: 0 0.5rem;

  .account-selection {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    margin: 1.5rem auto 1.5rem auto;
    width: 100%;
    max-width: 500px;

    > h4 {
      color: var(--text-color-tertiary);
      text-transform: uppercase;
      margin: 0;
    }

    > p {
      line-height: 1.5rem;
    }
  }

  .submit-section {
    display: flex;
    margin-top: 0.5rem;
    justify-content: flex-end;
  }
`

export const TitleWrapper = styled.h1`
  font-family: 'Inter', sans-serif;
  text-align: center;
  margin-top: 0;
`
