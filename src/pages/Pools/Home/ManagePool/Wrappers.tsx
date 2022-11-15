// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { SectionFullWidthThreshold } from 'consts';
import styled from 'styled-components';
import { borderPrimary } from 'theme';

export const RolesWrapper = styled.div`
  display: flex;
  flex-flow: row wrap;
  width: 100%;
  margin-top: 0.25rem;

  > section {
    flex: 1 1 25%;
    padding: 0 0.5rem;
    border-right: 1px solid ${borderPrimary};

    @media (max-width: ${SectionFullWidthThreshold}px) {
      flex-basis: 100%;
      border-right: none;
      border-bottom: 1px solid ${borderPrimary};
      margin: 0.75rem 0;

      &:first-child {
        margin-top: 0;
      }
      &:last-child {
        margin-bottom: 0;
        border-bottom: 0;
      }
    }

    &:last-child {
      border-right: none;
    }

    .inner {
      flex: 1;
      padding: 0 0.5rem;

      @media (max-width: ${SectionFullWidthThreshold}px) {
        padding: 0;
      }

      > h4 {
        display: flex;
        align-items: center;
        margin-bottom: 0rem;

        > .help-icon {
          margin-left: 0.5rem;
        }
      }
    }
  }
`;
