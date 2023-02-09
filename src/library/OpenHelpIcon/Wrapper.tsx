// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import styled from 'styled-components';

export const Wrapper = styled.button<{ light?: boolean }>`
  background: ${(props) =>
    props.light
      ? 'var(--button-primary-background)'
      : 'var(--button-tertiary-background'};
  color: var(--text-color-secondary);
  fill: var(--text-color-secondary);
  display: flex;
  flex-flow: row wrap;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  padding: 0.05rem;
  transition: all 0.15s;
  font-size: 1.15rem;

  &:hover {
    fill: var(--network-color-primary);
  }
`;
