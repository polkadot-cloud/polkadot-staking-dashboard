// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import styled from 'styled-components';

export const Wrapper = styled.div`
  padding: 0.15rem 0.25rem;
  width: 100%;
  h4 {
    display: flex;
    flex-flow: row wrap;
    align-items: center;
    justify-content: flex-start;
    margin: 0 0 0.5rem 0;

    .help-icon {
      margin-left: 0.55rem;
    }
  }
  h2 {
    &.stat {
      display: flex;
      flex-flow: row wrap;
      align-items: center;
      margin: 0;
      > span {
        flex-grow: 1;
      }
    }
  }
`;
