// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import styled from 'styled-components';
import { backgroundLabel, textSecondary } from 'theme';
import { WrapperProps } from './types';

export const Wrapper = styled.div<WrapperProps>`
  position: absolute;
  top: ${(props) => (props.topOffset ? props.topOffset : '50%')};
  left: 0;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2;

  > div {
    min-width: 125px;
    background: ${backgroundLabel};
    opacity: 0.75;
    padding: 1rem 1.25rem;
    border-radius: 1rem;
    display: flex;
    align-items: center;
    justify-content: center;

    > svg {
      color: ${textSecondary};
    }
    h2 {
      padding: 0;
      margin: 0;
      display: flex;
      flex-flow: row wrap;
      align-items: center;
      font-size: 1.2rem;
      opacity: 0.75;
    }

    span {
      margin-left: 0.65rem;
    }
  }
`;
