// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import styled from 'styled-components';

export const SplashWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-flow: column wrap;
  align-items: center;
  justify-content: center;

  .icon {
    width: 100%;
    display: flex;
    justify-content: center;
    z-index: 0;
    margin-bottom: 2rem;
  }

  .content {
    z-index: 1;
    display: flex;
    flex-flow: column nowrap;
    justify-content: center;
    margin-bottom: 2rem;

    h2,
    h5 {
      color: var(--text-color-secondary);
      display: flex;
      align-items: center;
      justify-content: center;
      margin-top: 0.35rem;
    }

    h2 {
      margin-bottom: 0.75rem;
    }
    h5 {
      min-height: 2rem;
    }

    .button {
      display: flex;
      justify-content: center;
      margin-top: 1rem;
    }
  }
`;

export const TitleWrapper = styled.div`
  --tab-height: 2.25rem;

  background: var(--background-primary);
  -webkit-app-region: drag;
  padding: 0.95rem 0.85rem 0.7rem 0.85rem;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 3;
  display: flex;
  flex-direction: column;

  .tabs {
    width: 100%;
    height: var(--tab-height);
    display: flex;
    margin: 0.5rem 0 0.1rem 0;

    button {
      padding: 0rem 1rem;
      transition: background 0.15s;
      height: var(--tab-height);
      border-radius: 0.4rem;
      margin-right: 0.75rem;

      > div {
        height: var(--tab-height);
        display: flex;
        align-items: center;
      }
      &:hover {
        background: var(--background-secondary);
      }
      &.active {
        background: var(--background-secondary);
      }
    }
  }

  > h5 {
    svg {
      margin-right: 0.4rem;
    }
  }
`;
