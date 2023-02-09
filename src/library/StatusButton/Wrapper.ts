// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import styled from 'styled-components';

export const Wrapper = styled.button`
  color: var(--text-color-primary);
  width: 100%;
  flex: 1;
  padding: 1rem 0.75rem;
  border-radius: 0.75rem;
  margin-bottom: 1rem;
  font-size: 1rem;
  display: flex;
  flex-flow: row-reverse wrap;
  align-items: center;
  background: var(--button-primary-background);
  transition: all 0.15s;

  > section:last-child {
    color: var(--text-color-secondary);
    padding-left: 0.25rem;
    display: flex;
    flex-flow: row wrap;
    flex: 1;
  }

  &:hover {
    > section {
      color: var(--text-color-primary);
    }
  }
`;
