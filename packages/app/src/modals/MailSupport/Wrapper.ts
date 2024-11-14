// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import styled from 'styled-components';

export const SupportWrapper = styled.div`
  padding: 0 1.75rem 2rem 1.75rem;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;

  > svg {
    width: 100%;
    height: auto;
    max-width: 7rem;
  }

  > h1 {
    margin-top: 0.5rem;
    a {
      color: var(--text-color-primary);
    }
  }

  > h4 {
    padding: 2.5rem 1.5rem 0.75rem 1.5rem;
    text-align: center;
  }
`;
