// Copyright 2026 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import styled from 'styled-components'

export const ModeToggle = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;

  button {
    background-color: var(--gray-300);
    color: var(--gray-700);
    padding: 0.4rem 1rem;
    border-radius: 1.25rem;
    font-size: 0.9rem;
    font-weight: 600;
    border: none;
    cursor: pointer;

    &.active {
      background-color: var(--accent-200);
      color: var(--accent-900);
    }
  }
`

export const QrContainer = styled.div`
  background-color: var(--gray-300);
  border: 1px solid var(--gray-400);
  width: 210px;
  height: 210px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 1rem;
  position: relative;
`

export const SpinnerOverlay = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 1rem;
`

export const QrImage = styled.img`
  width: 180px;
  height: 180px;
  image-rendering: pixelated;
`
