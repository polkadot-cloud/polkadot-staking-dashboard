// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import styled from 'styled-components';
import { borderPrimary, textSecondary } from 'theme';

export const Spacer = styled.div`
  width: 100%;
  height: 1px;
  margin: 0.75rem 0;
`;

export const RowWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-flow: row wrap;
  align-items: flex-end;

  > div:last-child {
    height: 100%;
    flex-grow: 1;
    display: flex;
    flex-flow: row wrap;
    align-items: flex-end;
    padding: 0.5rem 1rem;
  }
`;

export const InputWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-flow: column wrap;

  h3 {
    color: ${textSecondary};
    margin: 0;
    padding: 0 0.25rem;
  }

  > .inner {
    width: 100%;
    display: flex;
    flex-flow: row wrap;
    align-items: center;
    margin-top: 0.75rem;
    padding: 0;

    > section {
      &:first-child {
        flex-grow: 1;
      }
      &:last-child {
        padding: 0 0.25rem 0 1.25rem;
      }
      .input {
        width: 100%;
        max-width: 100%;
        border: 1px solid ${borderPrimary};
        padding: 1rem;
        border-radius: 0.75rem;
        display: flex;
        flex-flow: row wrap;
        align-items: center;

        > div {
          &:first-child {
            flex-grow: 1;
          }
          &:last-child {
            color: ${textSecondary};
            justify-content: flex-end;
            opacity: 0.5;
            position: relative;
            p {
              position: absolute;
              top: 0;
              left: 0;
              width: 100%;
              text-overflow: ellipsis;
              white-space: nowrap;
              overflow: hidden;
              position: relative;
              margin: 0;
              font-size: 1rem;
            }
          }
          > input {
            border: none;
            padding: 0;
            width: 100%;
            max-width: 100%;
            flex-grow: 1;
          }
        }
      }
    }
  }
`;
