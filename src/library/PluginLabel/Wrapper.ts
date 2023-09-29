// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import styled from 'styled-components';

export const Wrapper = styled.div<{ $active: boolean }>`
  position: absolute;
  right: 10px;
  top: 10px;
  font-size: 0.9rem;
  border-radius: 0.3rem;
  padding: 0.25rem 0.4rem;
  color: ${(props) =>
    props.$active
      ? 'var(--accent-color-primary)'
      : 'var(--text-color-secondary)'};
  opacity: ${(props) => (props.$active ? 1 : 0.5)};
  z-index: 2;

  > svg {
    margin-right: 0.3rem;
  }
`;
