// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import styled from 'styled-components';
import { buttonPrimaryBackground, backgroundToggle, textPrimary, textInvert, textSecondary, textDanger } from '../../theme';

export const Wrapper = styled.div`
  display: flex;
  flex-flow: column wrap;
  align-items: center;
  justify-content: flex-start;
  padding: 1rem;

  h2 {
    margin-top: 0.5rem;
    color: ${textPrimary};
  }

  .head {
    width: 100%;
    display: flex;
    flex-flow: row wrap;
    align-items: center;
    margin-bottom: 1rem;
  }

  button {
    display: flex;
    flex-flow: row wrap;
    justify-content: flex-start;
    align-items: center;
    font-size: 1.1rem;

    &:disabled {
      cursor: default;
      opacity: 0.5;
    }
    
    &.item {
      box-sizing: border-box;
      width: 100%;
      min-height: 3.5rem;
      margin: 0.4rem 0;
      padding: 0.75rem 0.25rem;
      border-radius: 1rem;
      font-size: 1rem;
      background: ${buttonPrimaryBackground};
      transition: background 0.15s;
      color: ${textPrimary};

      &:hover {
        background: ${backgroundToggle};
      }

      > div {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        flex: 1;
        padding: 0 1rem;

        &:last-child {
          justify-content: flex-end;

          &.neutral {
            color: ${textSecondary};
            opacity: 0.75;
          }
          &.danger {
            color: ${textDanger};
          }

          .icon {
            margin-left: 1rem;
          }
        }

        /* svg theming */
        svg {
          .light {
            fill: ${textInvert};
          }
          .dark {
            fill: ${textSecondary};
          }
        }
      }
    }
}
`;

export const Separator = styled.div`
  border-top: 1px solid ${textSecondary};
  width: 100%;
  opacity: 0.1;
  margin: 0.75rem 0rem;
`;

export default Wrapper;