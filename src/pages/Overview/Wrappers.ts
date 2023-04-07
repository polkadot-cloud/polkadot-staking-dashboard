// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { SectionFullWidthThreshold } from 'consts';
import styled from 'styled-components';

export const ActiveAccounWrapper = styled.div`
  width: 100%;

  .account {
    display: flex;
    flex-flow: row wrap;
    align-items: center;
    overflow: hidden;
    width: 100%;

    .icon {
      position: relative;
      top: 0.1rem;
      margin-right: 0.5rem;
    }
    .title {
      margin: 0;
      padding: 0;
      flex: 1;
      overflow: hidden;
    }
    .rest {
      flex: 1 1 0%;
      min-height: 1.8rem;
      overflow: hidden;
      position: relative;

      .name {
        position: absolute;
        left: 0;
        bottom: 0.1rem;
        max-width: 100%;
        display: inline;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
        opacity: 0.75;
      }
    }

    button {
      width: 2rem;
      height: 2rem;
      border-radius: 50%;
      margin-left: 0.75rem;
      padding: 0;
    }

    h3 {
      display: flex;
      flex-flow: row wrap;
      align-items: center;
      flex: 1;

      > .sep {
        border-right: 1px solid var(--border-secondary-color);
        margin: 0 0.8rem;
        width: 1px;
        height: 1.25rem;
      }
      > .addr {
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
      }
    }

    > *:last-child {
      flex-grow: 1;
      display: flex;
      flex-flow: row-reverse wrap;

      .copy {
        color: var(--text-color-secondary);
        opacity: 0.9;
        cursor: pointer;
        transition: opacity var(--transition-duration);
        &:hover {
          opacity: 1;
        }
      }
    }
  }
`;

export const Separator = styled.div`
  border-bottom: 1px solid var(--border-primary-color);
  margin-top: 0.8rem;
  width: 100%;
  height: 1px;
`;

export const MoreWrapper = styled.div`
  padding: 0 1.25rem;
  padding-bottom: 1rem;
  width: 100%;
  display: flex;
  flex-flow: column wrap;
  margin-top: 2.75rem;
  @media (max-width: ${SectionFullWidthThreshold}px) {
    margin-top: 1rem;
    margin-bottom: 0.5rem;
  }
  h4 {
    margin-top: 0.25rem;
    margin-bottom: 0.25rem;
  }
  section {
    width: 100%;
    margin-top: 0.1rem;
  }
`;
