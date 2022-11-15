// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import styled from 'styled-components';
import {
  borderPrimary,
  borderSecondary,
  buttonPrimaryBackground,
  textPrimary,
  textSecondary,
} from 'theme';

export const Wrapper = styled.div`
  color: ${textPrimary};
  border-radius: 0.75rem;
  width: 100%;
  margin: 1rem 0;
  border-radius: 0.5rem;
  background: ${buttonPrimaryBackground};
  transition: background 0.15s;
  display: flex;
  flex-flow: column nowrap;
  align-items: flex-start;
  min-height: 3.5rem;

  > .content {
    padding: 0 1rem;
    width: 100%;
  }

  .accounts {
    margin-top: 1rem;
    width: 100%;
  }

  .account {
    width: 100%;
    border: 1px solid ${borderPrimary};
    border-radius: 0.75rem;
    margin: 1rem 0;
    padding: 1rem;
    display: flex;
    flex-flow: row wrap;
    transition: border 0.1s;

    > div {
      color: ${textSecondary};
      transition: opacity 0.2s;

      &:first-child {
        flex: 1;
        display: flex;
        flex-flow: row wrap;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      &:last-child {
        padding-left: 2rem;
        opacity: 0.25;
      }
    }

    &:hover {
      > div:last-child {
        opacity: 1;
      }
    }

    &:hover {
      border-color: ${borderSecondary};
    }
  }
`;
