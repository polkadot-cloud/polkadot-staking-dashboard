// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { PageWidthMediumThreshold } from 'consts';
import styled from 'styled-components';

export const ScrollableWrapper = styled.div`
  background: var(--background-default);
  display: none;
  position: fixed;
  top: 0;
  width: 100%;
  height: 4rem;
  z-index: 4;

  @media (max-width: ${PageWidthMediumThreshold}px) {
    display: block;
  }
`;

export const PageTitleWrapper = styled.header`
  background: var(--background-default);
  display: flex;
  flex-flow: column wrap;
  justify-content: flex-end;
  position: sticky;
  margin-top: 5rem;
  margin-bottom: 0.5rem;
  padding-top: 0.5rem;
  padding-bottom: 0;
  top: 0;
  transition: padding 0.3s ease-out;
  width: 100%;
  z-index: 5;

  @media (max-width: ${PageWidthMediumThreshold}px) {
    top: 4rem;
    padding-top: 0.75rem;
    padding-bottom: 0.5rem;
    margin-bottom: 0;
  }

  .title {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    width: 100%;
    margin-bottom: 0.5rem;

    @media (max-width: ${PageWidthMediumThreshold}px) {
      margin-bottom: 0.5rem;
    }

    > .right {
      padding-left: 1rem;
      flex-grow: 1;
    }
  }

  h1 {
    font-size: 2rem;
    font-family: Poppins700, sans-serif;
    font-weight: 700;
    position: relative;
    transform: scale(1);
    left: 0;

    @media (max-width: ${PageWidthMediumThreshold}px) {
      left: 0rem;
      transform: scale(0.9);
    }

    transition: all var(--transition-duration);
    margin: 0;
  }

  &.sticky {
    padding-top: 1.5rem;
    padding-bottom: 0.25rem;
    margin-bottom: 0.25rem;

    .title {
      margin-bottom: 0.5rem;

      h1 {
        transform: scale(0.85);
        left: -0.75rem;
      }
    }
  }
`;
