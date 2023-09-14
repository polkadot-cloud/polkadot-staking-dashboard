// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import styled from 'styled-components';
import { SectionFullWidthThreshold } from 'consts';

export const Separator = styled.div`
  border-bottom: 1px solid var(--border-primary-color);
  margin-top: 0.8rem;
  width: 100%;
  height: 1px;
`;

export const MoreWrapper = styled.div`
  padding: 0 0.5rem;
  padding-bottom: 1rem;
  width: 100%;
  display: flex;
  flex-flow: column wrap;
  margin-top: 2.5rem;

  @media (max-width: ${SectionFullWidthThreshold}px) {
    margin-top: 1.5rem;
    padding: 0 0.75rem;
    margin-bottom: 0.5rem;
  }
  h4 {
    margin-top: 0.25rem;
    margin-bottom: 0.5rem;
  }
  section {
    display: flex;
    align-items: center;
    width: 100%;
    margin-top: 0.1rem;
    div {
      margin-left: 0.5rem;
    }
  }
`;

export const BannerWrapper = styled.div`
  &.light {
    border: 1px solid var(--accent-color-primary);
    background: var(--background-primary);

    .label,
    > div h3 {
      color: var(--accent-color-primary);
    }
  }
  &.dark {
    border: 1px solid var(--border-secondary-color);
    background: var(--accent-color-secondary);

    .label,
    > div h3 {
      color: white;
    }
    div > button {
      color: white;
      border-color: white;
    }
  }
  box-shadow: var(--card-shadow-secondary);
  border-radius: 1.25rem;
  padding: 1.25rem 1.5rem;
  margin-top: 5rem;
  width: 100%;

  .label {
    color: white;
    margin-bottom: 0.75rem;

    .icon {
      margin-right: 0.35rem;
    }
  }

  > div {
    display: flex;
    align-items: center;

    h3 {
      font-family: InterSemiBold, sans-serif;
      line-height: 1.8rem;
    }
    button {
      flex-basis: auto;
      font-size: 1.1rem;
      margin-left: 0.75rem;
    }
    @media (max-width: 800px) {
      flex-direction: column;
      align-items: flex-start;

      button {
        margin-top: 0.75rem;
        margin-left: 0;
        position: relative;
        left: -0.5rem;
      }
    }
  }
`;
