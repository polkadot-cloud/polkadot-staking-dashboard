/* @license Copyright 2024 @polkadot-cloud/library authors & contributors
SPDX-License-Identifier: GPL-3.0-only */

import styled from 'styled-components';

export const Wrapper = styled.h3`
  border-bottom: 1px solid var(--border-primary-color);
  color: var(--text-color-primary);
  font-family: InterSemiBold, sans-serif;
  font-weight: 600;
  display: flex;
  align-items: center;
  margin: 1.25rem 0 0;
  padding-bottom: 0.75rem;
  width: 100%;

  > svg {
    margin-right: 0.65rem;
  }

  .toggle {
    background: var(--background-input);
    border: 1px solid var(--border-primary-color);
    border-radius: 0.4rem;
    margin-right: 0.65rem;
    width: 1.75rem;
    height: 1.75rem;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  span {
    margin-left: 0.5rem;
  }
`;
