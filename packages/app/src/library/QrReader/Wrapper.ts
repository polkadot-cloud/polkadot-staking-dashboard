// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import styled from 'styled-components'

export const Wrapper = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 9;
  animation: fadeInScale 0.2s cubic-bezier(0, 1, 0, 1) forwards;

  > .qrRegion {
    background: var(--background-default);
    border-radius: 0.85rem;
    overflow: hidden;
    width: 250px;
    height: 188px;
    margin: 0.5rem 0;
  }

  > h4 {
    margin-bottom: 1rem;
  }

  @keyframes fadeInScale {
    from {
      opacity: 0.75;
      transform: scale(0.75);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }
`
