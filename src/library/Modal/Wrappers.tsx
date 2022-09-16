// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import styled from 'styled-components';

// title wrapper for modals
export const TitleWrapper = styled.div<{ fixed: boolean }>`
  box-sizing: border-box;
  width: 100%;
  padding: ${(props) =>
    props.fixed ? '0.6rem 1rem 1.5rem 1rem' : '1.6rem 1rem 0 1rem'};
  display: flex;
  flex-flow: row wrap;
  justify-content: flex-start;
  align-items: center;
  flex: 1;

  > h2 {
    font-family: 'Unbounded', 'sans-serif', sans-serif;
    font-size: 1.3rem;
    margin: 0;
  }

  > svg {
    margin-right: 0.9rem;
  }
`;
