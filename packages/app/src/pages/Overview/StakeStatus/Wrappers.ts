// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { PageWidthMediumThreshold } from 'consts'
import styled from 'styled-components'

export const SectionNavigation = styled.div`
  display: flex;
  gap: 0.5rem;
  padding: 0.85rem 0.85rem;
  border-bottom: 1px solid var(--border);
  
  @media (max-width: ${PageWidthMediumThreshold}px) {
    padding: 1rem 1rem 0;
  }
`

export const SectionSlider = styled.div<{ $activeSection: number }>`
  display: flex;
  width: 200%;
  overflow: hidden;
  
  .section {
    flex: 0 0 50%;
    width: 50%;
    transition: transform 0.5s ease-in-out;
    transform: translateX(-${(props) => props.$activeSection * 100}%);
  }
`

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

    &:nth-child(2) {
      @media (max-width: 1400px) {
        margin-top: 1rem;
      }

      padding-left: 1.5rem;
      @media (max-width: ${PageWidthMediumThreshold}px) {
        padding-left: 0;
      }
    }

    > section {
      border-bottom: 1px solid var(--border);
      padding-left: 1.5rem;
      padding-bottom: 0.35rem;
      border-radius: 0;

      @media (max-width: ${PageWidthMediumThreshold}px) {
        padding-left: 1rem;
      }

      > div {
        padding-top: 0;
      }
    }
  }
`
