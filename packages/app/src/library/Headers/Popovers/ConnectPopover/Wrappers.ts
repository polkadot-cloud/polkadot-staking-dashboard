// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import styled from 'styled-components'

export const ImportQRWrapper = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  > .qrRegion {
    background-color: var(--background-invert);
    border-radius: 0.35rem;
    overflow: hidden;
    width: 250px;
    height: 188px;
    margin: 0.5rem 0;
  }

  > h4 {
    margin-bottom: 1rem;
  }
`
