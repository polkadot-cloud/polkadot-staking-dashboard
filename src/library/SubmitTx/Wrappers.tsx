// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import styled from 'styled-components';
import { backgroundToggle, textSecondary } from 'theme';

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-top: 1rem;
  margin-bottom: 0.75rem;
  padding: 0 0.6rem;

  .sign {
    opacity: 0.75;
    font-size: 0.9rem;
    margin-bottom: 0.4rem;
    padding-left: 0.5rem;
  }

  > .inner {
    background: ${backgroundToggle};
    width: 100%;
    padding: 0.6rem;
    border-radius: 0.75rem 0.75rem 1rem 1rem;
    display: flex;
    flex-direction: column;

    > section {
      width: 100%;
      display: flex;
      align-items: center;

      p {
        color: ${textSecondary};
        font-size: 1rem;
        opacity: 0.75;
        margin: 0;
        padding-left: 0.4rem;
        font-variation-settings: 'wght' 575;
      }

      > div {
        &:first-child {
          display: flex;
          flex-direction: column;
          justify-content: center;
          flex-grow: 1;
        }
        &:last-child {
          display: flex;
          align-items: center;
          flex: 1;
          justify-content: flex-end;

          button {
            margin-left: 0.75rem;
          }
        }
      }
    }
  }
`;
