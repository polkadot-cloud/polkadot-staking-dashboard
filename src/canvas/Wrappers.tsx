// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import styled from 'styled-components';

export const CanvasFullScreenWrapper = styled.div`
  padding-top: 3rem;
  min-height: calc(100vh - 12rem);
  padding-bottom: 2rem;

  > .head {
    display: flex;
    align-items: center;
    justify-content: flex-end;
  }

  > h1 {
    margin-top: 1.5rem;
    margin-bottom: 1.25rem;
  }
`;

export const CanvasSubmitTxFooter = styled.div`
  border-radius: 1rem;
  overflow: hidden;
  margin-bottom: 2rem;
`;
