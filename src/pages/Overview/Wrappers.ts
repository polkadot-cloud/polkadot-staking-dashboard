// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { SectionFullWidthThreshold } from 'consts';
import styled from 'styled-components';

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
  margin-top: 3.5rem;
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
    display: flex;
    flex-flow: row wrap;
    align-items: center;

    > div {
      margin-right: 1rem;
    }
  }
`;
