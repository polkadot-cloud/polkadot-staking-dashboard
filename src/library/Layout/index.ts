// Copyright 2022 @rossbulat/polkadot-staking-experience authors & contributors
// SPDX-License-Identifier: Apache-2.0

import styled from 'styled-components';
import { SIDE_MENU_STICKY_THRESHOLD } from '../../constants';

export const MainWrapper = styled.div<any>`
  box-sizing: border-box;
  flex-basis: 60%;

  @media(min-width: ${SIDE_MENU_STICKY_THRESHOLD}px) {
    flex-basis: 66%;
    max-width: 66%;
  }
  overflow: hidden;
  flex: 1;
  ${props => props.paddingLeft && `
  padding-left: 1rem;`
  }
  ${props => props.paddingRight && `
  padding-right: 1rem;`
  }
`;

export const SecondaryWrapper = styled.div`
  box-sizing: border-box;
  flex-basis: 40%;
  max-width: 40%;
  border-radius: 1rem;
  flex: 1;
`;

export const StickyWrapper = styled.div`
  position: sticky;
  top: 80px;

  @media(max-width: ${SIDE_MENU_STICKY_THRESHOLD}px) {
    top: 100px;
  }
`;