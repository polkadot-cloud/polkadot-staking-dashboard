// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import styled from 'styled-components';
import { PageWidthMediumThreshold } from 'consts';

export const StatusWrapper = styled.div<{ $borderBottom: boolean }>`
  display: flex;
  flex-wrap: wrap;
  padding: 1.5rem 1.5rem 0 1.5rem;

  @media (max-width: ${PageWidthMediumThreshold}px) {
    padding: 1.5rem 0.75rem 0 0.75rem;
  }

  > div {
    @media (max-width: ${PageWidthMediumThreshold}px) {
      margin-top: 1rem;
    }

    &:first-child {
      margin-top: 0;
    }

    &:last-child {
      padding-left: 1.5rem;
      @media (max-width: ${PageWidthMediumThreshold}px) {
        padding-left: 0;
      }
    }

    > section {
      border-bottom: ${(props) =>
        props.$borderBottom ? '1px solid var(--border-primary-color)' : 'none'};
      padding-bottom: 0.75rem;
      @media (max-width: ${PageWidthMediumThreshold}px) {
        padding-bottom: 0.5rem;
      }
      border-radius: 0;

      > div {
        padding-top: 0;
      }
    }
  }
`;
