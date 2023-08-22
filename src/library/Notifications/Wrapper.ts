// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import styled from 'styled-components';

export const Wrapper = styled.ul`
  position: fixed;
  bottom: 20px;
  right: 0;
  display: flex;
  flex-direction: column;
  list-style: none;
  justify-content: flex-end;
  z-index: 10;

  li {
    background: var(--background-primary);
    width: 360px;
    margin: 0.4rem 1.2rem;
    position: relative;
    border-radius: 10px;
    padding: 1rem 1.5rem;
    display: flex;
    flex-flow: column wrap;
    justify-content: center;
    cursor: pointer;
    overflow: hidden;

    h3 {
      color: var(--accent-color-primary);
      margin: 0 0 0.5rem;
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
