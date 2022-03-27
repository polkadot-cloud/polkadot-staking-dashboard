// Copyright 2022 @rossbulat/polkadot-staking-experience authors & contributors
// SPDX-License-Identifier: Apache-2.0

import styled from 'styled-components';

export const MainWrapper = styled.div<any>`
  box-sizing: border-box;
  flex-basis: 60%;
  max-width: 60%;
  overflow: hidden;
  flex: 1;
  ${props => props.paddingLeft && `
  padding-left: 1.2rem;`
  }
  ${props => props.paddingRight && `
  padding-right: 1.2rem;`
  }
`;

export const SecondaryWrapper = styled.div`
  box-sizing: border-box;
  flex-basis: 40%;
  max-width: 40%;
  border-radius: 1rem;
  flex: 1;
`;
