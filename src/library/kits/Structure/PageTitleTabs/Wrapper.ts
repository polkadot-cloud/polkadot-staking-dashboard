// Copyright 2024 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { SideMenuStickyThreshold } from 'consts';
import styled from 'styled-components';

export const Wrapper = styled.section`
  border-bottom: 1px solid var(--border-primary-color);
  overflow: hidden;
  height: 3.6rem;
  margin-top: 0.9rem;
  max-width: 100%;

  @media (max-width: ${SideMenuStickyThreshold}px) {
    margin-top: 0.5rem;
  }

  > .scroll {
    @include m.hide-scrollbar;

    width: 100%;
    height: 4.5rem;
    overflow: auto hidden;
  }

  .inner {
    display: flex;
  }

  &.sticky {
    border-bottom: 0;
    margin-top: 0.5rem;
  }
`;
