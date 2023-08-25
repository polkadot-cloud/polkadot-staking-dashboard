// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import styled from 'styled-components';

export const Wrapper = styled.div<{ $minimised: boolean }>`
  display: flex;
  flex-flow: row wrap;
  justify-content: ${(props) => (props.$minimised ? 'center' : 'flex-start')};
  opacity: ${(props) => (props.$minimised ? 0.5 : 1)};
  align-items: center;

  h5 {
    color: var(--text-color-secondary);
    margin: 1.1rem 0 0.3rem 0;
    padding: 0 0.5rem;
    opacity: 0.7;
  }
`;
