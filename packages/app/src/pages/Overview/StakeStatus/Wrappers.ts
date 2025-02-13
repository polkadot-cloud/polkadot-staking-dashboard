// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { PageWidthMediumThreshold } from 'consts'
import styled from 'styled-components'

export const StatusWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  padding-top: 1.5rem;
  > div {
    @media (max-width: ${PageWidthMediumThreshold}px) {
      margin-top: 1rem;
    }

    &:first-child {
      margin-top: 0;
    }

    &:last-child {
      padding-left: 1.5rem;
      @media (max-width: ${PageWidthMediumThreshold}px) {
        padding-left: 0;
      }
    }

    > section {
      border-bottom: 1px solid var(--border-primary-color);
      padding-left: 1.5rem;
      padding-bottom: 0.35rem;
      border-radius: 0;

      > div {
        padding-top: 0;
      }
    }
  }
`
