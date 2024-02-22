// Copyright 2024 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { PageWidthMediumThreshold, SideMenuMinimisedWidth } from 'consts';
import styled from 'styled-components';

export const Wrapper = styled.div`
  z-index: 7;
  position: sticky;
  top: 0;
  height: 100vh;
  flex: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  transition: all 0.5s cubic-bezier(0.1, 1, 0.2, 1);

  /* maximised by default, or minimised otherwise. */
  min-width: var(--core-side-width);
  max-width: var(--core-side-width);

  &.minimised {
    min-width: ${SideMenuMinimisedWidth}px;
    max-width: ${SideMenuMinimisedWidth}px;
  }

  @media (max-width: ${PageWidthMediumThreshold}px) {
    position: fixed;
    top: 0;
    left: 0;

    &.hidden {
      left: calc(var(--core-side-width) * -1);
    }
  }
`;
