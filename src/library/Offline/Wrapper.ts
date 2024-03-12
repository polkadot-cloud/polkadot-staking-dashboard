// Copyright 2024 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import styled from 'styled-components';

export const Wrapper = styled.div`
  background: var(--accent-color-primary);
  border: 0.5px solid var(--border-primary-color);
  position: fixed;
  bottom: 3.8rem;
  right: 1rem;
  z-index: 999;
  padding: 0.75rem 1.15rem;
  border-radius: 0.6rem;
  display: flex;
  align-items: center;

  > h3,
  svg {
    color: var(--text-color-invert);
  }

  > svg {
    margin-right: 0.75rem;
  }
`;
