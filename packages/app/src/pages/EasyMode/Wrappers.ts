// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import styled from 'styled-components'

export const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
`

export const SectionHeader = styled.h2`
  font-size: 1.3rem;
  margin-bottom: 0.5rem;
  color: var(--text-primary);
`

export const ActionsRow = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
  flex-wrap: wrap;
`

export const WarningBox = styled.div`
  margin-top: 1rem;
  padding: 0.75rem;
  background: rgba(255, 165, 0, 0.15);
  border: 1px solid rgba(255, 165, 0, 0.5);
  border-radius: 4px;
  font-size: 0.9rem;
  color: #a95300;
`

export const OverviewCard = styled.div`
  padding: 1rem;
  width: 100%;
`
