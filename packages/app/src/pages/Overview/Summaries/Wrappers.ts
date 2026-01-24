// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { PageWidthMediumThreshold } from 'consts'
import styled from 'styled-components'

export const SectionNav = styled.div`
  display: flex;
  gap: 0.75rem;
  padding: 1rem;
  @media (max-width: ${PageWidthMediumThreshold}px) {
    padding: 1rem 1rem 0;
  }
`

export const SectionsArea = styled.div<{ $activeSection: number }>`
  display: flex;
  width: 200%;
  overflow: hidden;
  flex: 1;
  
  .section {
    flex: 0 0 50%;
    width: 50%;
    transition: transform 0.5s cubic-bezier(0.2, 1, 0.2, 1);
    transform: translateX(-${(props) => props.$activeSection * 100}%);
    display: flex;
    flex-direction: column;
  }
`

export const SectionWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  flex: 1;
  
  .content {
    display: flex;
    flex-wrap: wrap;
    flex-direction: column;
    padding: 0.75rem 1.5rem 0.25rem 1.5rem;
    flex: 1;
  }

  > div {
    &:nth-child(2) {
      @media (max-width: 1400px) {
        margin-top: 1rem;
      }
    }

    > section {
      padding-left: 1.5rem;
      padding-bottom: 0.35rem;

      @media (max-width: ${PageWidthMediumThreshold}px) {
        padding-left: 1rem;
      }

      > div {
        padding-top: 0;
      }
    }
  }
`

export const StatItem = styled.div`
  border-bottom: 1px solid var(--border);
  padding: 0.75rem 0;
  color: var(--text-secondary);
  display: flex;
  align-items: center;
  font-size: 1.2rem;
  gap: 0.5rem;
  font-family: Inter, sans-serif;
  margin-right: 1.25rem;

  &:last-child {
    margin-right: 0;
  }
`
