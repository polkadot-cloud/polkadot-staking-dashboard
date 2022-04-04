// Copyright 2022 @rossbulat/polkadot-staking-experience authors & contributors
// SPDX-License-Identifier: Apache-2.0

import styled from 'styled-components';
import { SIDE_MENU_INTERFACE_WIDTH, INTERFACE_MAXIMUM_WIDTH, SIDE_MENU_STICKY_THRESHOLD } from '../../constants';

export const MainWrapper = styled.div<any>`
  box-sizing: border-box;
  flex-basis: 66%;
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
  flex-basis: 33%;
  max-width: 33%;
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

export const HalfWrapper = styled.div<any>`
  display: flex;
  flex-flow: row nowrap;
  width: 100%;
  box-sizing: border-box;
  align-items: ${props => props.alignItems};

  > section > div {
    width: 100%;
  }

  > section:first-child {
    padding-right: 0.75rem;
  }
  > section:last-child {
    padding-left: 0.75rem;
  }
`;

export const HalfItem = styled.section`
  display: flex;
  flex-flow: column wrap;
  flex-basis: 50%;
  box-sizing: border-box;
  flex: 1;
`;

export const ColumnWrapper = styled.div`
  display: flex;
  flex-flow: column wrap;
  width: 100%;
  box-sizing: border-box;
`;

export const ColumnItem = styled.section`
  display: flex;
  flex-flow: column wrap;
  box-sizing: border-box;
  padding-top: 1rem;

  p {
    margin: 0;
  }
`;
