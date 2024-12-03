// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import styled from 'styled-components'

export const DisplayWrapper = styled.div`
  > div {
    height: 100%;
    width: 100%;

    > img,
    > svg {
      background: white;
      height: auto !important;
      max-height: 100%;
      max-width: 100%;
      width: auto !important;
    }
  }
`

export const ScanWrapper = styled.div`
  > div {
    display: inline-block;
    height: 100%;
    transform: matrix(-1, 0, 0, 1, 0, 0);
    width: 100%;

    video {
      margin: 0;
    }
  }
`
