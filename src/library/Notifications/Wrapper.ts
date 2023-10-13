// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import styled from 'styled-components';

export const Wrapper = styled.ul`
  position: fixed;
  top: 0;
  right: 0;
  display: flex;
  flex-direction: column;
  list-style: none;
  justify-content: flex-end;
  z-index: 10;

  li {
    background: var(--background-primary);
    margin: 0.3rem 1.2rem;
    position: relative;
    border-radius: 0.75rem;
    padding: 1.25rem 1.5rem;
    display: flex;
    flex-flow: column wrap;
    justify-content: center;
    cursor: pointer;
    overflow: hidden;
    width: 375px;

    h3 {
      color: var(--accent-color-primary);
      font-family: InterSemiBold, sans-serif;
      margin: 0.15rem 0 0.75rem;
      flex: 1;
    }
    h5 {
      color: var(--text-color-secondary);
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
      flex: 1;
      max-width: 100%;
    }
  }
`;
