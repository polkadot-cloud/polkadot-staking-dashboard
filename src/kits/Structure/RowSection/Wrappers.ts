/* @license Copyright 2024 @polkadot-cloud/library authors & contributors
SPDX-License-Identifier: GPL-3.0-only */

import { SectionFullWidthThreshold, SideMenuStickyThreshold } from 'consts';
import styled from 'styled-components';

export const RowPrimaryWrapper = styled.div`
  &.first {
    @media (min-width: ${SideMenuStickyThreshold}px) {
      padding-left: 0.75rem;
      order: 1;
    }
  }

  &.last {
    @media (min-width: ${SideMenuStickyThreshold}px) {
      padding-right: 0.75rem;
    }
  }

  order: 0;
  flex: 1;
  flex-basis: 100%;
  max-width: 100%;

  @media (min-width: ${SideMenuStickyThreshold}px) {
    order: 0;
    flex: 1;
    flex-basis: 56%;
    width: 56%;
  }

  @media (min-width: ${SectionFullWidthThreshold + 400}px) {
    flex-basis: 62%;
    width: 62%;
  }

  &.v-last {
    order: 1;
  }
`;

export const RowSecondaryWrapper = styled.div`
  &.first {
    @media (min-width: ${SideMenuStickyThreshold}px) {
      padding-left: 0.75rem;
      order: 1;
    }
  }
  &.last {
    @media (min-width: ${SideMenuStickyThreshold}px) {
      padding-right: 0.75rem;
    }
  }

  order: 0;
  flex-basis: 100%;
  width: 100%;
  border-radius: 1rem;

  &.v-last {
    order: 1;
  }

  @media (min-width: ${SideMenuStickyThreshold}px) {
    order: 0;
    flex: 1;
    flex-basis: 44%;
    width: 44%;
    max-width: none;
  }

  @media (min-width: ${SectionFullWidthThreshold + 400}px) {
    flex-basis: 38%;
    max-width: 38%;
  }
`;
