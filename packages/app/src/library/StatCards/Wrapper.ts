// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import styled from 'styled-components'

export const StatContent = styled.div`
  background: var(--background-primary);
  box-shadow: var(--card-shadow-secondary);
  display: flex;
  border-radius: 0.6rem;
  margin-right: 1.25rem;
  padding: 0.9rem 0rem;
  max-height: 5.25rem;
  flex-flow: row wrap;

  @media (max-width: 799px) {
    box-shadow: var(--card-shadow);
  }

  > label {
    background: var(--background-invert);
    opacity: 0;
    position: absolute;
    top: -1rem;
    left: -8px;
    z-index: 2;
    border-radius: 0.5rem;
    padding: 0 0.5rem;
    width: max-content;
    max-width: 250px;
    transition: opacity var(--transition-duration);

    > h3 {
      color: var(--text-color-invert);
      font-family: InterSemiBold, sans-serif;
      text-align: center;
      margin: 0;
      font-size: 0.9rem;
    }
  }

  &:hover {
    label {
      opacity: 1;
    }
  }

  @media (max-width: 749px) {
    margin-right: 0;
    padding: 0.9rem 0;
  }

  > .labels {
    padding-left: 1.25rem;
    flex-basis: 70%;
    flex: 1;
    display: flex;
    flex-flow: column wrap;
    justify-content: center;
    overflow: hidden;
  }
`
