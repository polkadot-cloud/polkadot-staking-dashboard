// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import styled from 'styled-components';
import { backgroundLabel, networkColor, textSecondary } from 'theme';

export const Wrapper = styled.div`
  width: 100%;
  display: flex;
  flex-flow: row wrap;
  justify-content: flex-start;
  align-items: flex-end;
  margin-top: 1rem;

  .bars {
    width: 100%;
    display: flex;
    flex-flow: row wrap;
    justify-content: flex-start;
    align-items: flex-end;
    margin-top: 1rem;

    > section {
      padding: 0 0.15rem;

      &:nth-child(1) {
        flex-basis: 20%;
      }
      &:nth-child(2) {
        flex-basis: 80%;
      }
      h4,
      h5 {
        color: ${textSecondary};
      }

      h4 {
        display: flex;
        flex-flow: row wrap;
        align-items: center;
        margin-bottom: 0.4rem;
      }
      h5 {
        margin: 0;
        position: relative;
        opacity: 0.75;
      }
      .bar {
        background: ${backgroundLabel};
        width: 100%;
        padding: 0.65rem 0.75rem;
        overflow: hidden;
        position: relative;
        transition: background 0.15s;
      }
      &:first-child .bar {
        border-top-left-radius: 1.5rem;
        border-bottom-left-radius: 1.5rem;
        h5 {
          margin-left: 0.25rem;
        }
      }
      &:last-child .bar {
        border-top-right-radius: 1.5rem;
        border-bottom-right-radius: 1.5rem;
      }

      &.invert {
        h4 {
          color: ${networkColor};
        }
        h5 {
          opacity: 1;
          color: white;
        }
        .bar {
          background: ${networkColor};
        }
      }
    }
  }
`;
