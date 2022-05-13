// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import styled from 'styled-components';
import { SIDE_MENU_STICKY_THRESHOLD } from '../../constants';

export const MainWrapper = styled.div<any>`
  box-sizing: border-box;
  overflow: hidden;
  flex: 1;
  flex-basis: 100%;
  max-width: 100%;
  order: 0;

  @media(min-width: ${SIDE_MENU_STICKY_THRESHOLD + 1}px) {
    flex-basis: 62%;
    width: 62%;
    order: 1;
    flex: 1;
    ${props => props.paddingLeft && `padding-left: 1rem;`}
    ${props => props.paddingRight && ` padding-right: 1rem;`}
  }
`;

export const SecondaryWrapper = styled.div`
  box-sizing: border-box;
  overflow: hidden;
  flex-basis: 100%;
  width:100%;  
  border-radius: 1rem;
  order: 1;

  @media(min-width: ${SIDE_MENU_STICKY_THRESHOLD + 1}px) {
    flex-basis: 38%;
    max-width: 38%;
    flex-grow: 1;
    order: 0;
  }
`;

export const StickyWrapper = styled.div`
  position: sticky;
  top: 80px;

  @media(max-width: ${SIDE_MENU_STICKY_THRESHOLD + 1}px) {
    top: 100px;
  }
`;