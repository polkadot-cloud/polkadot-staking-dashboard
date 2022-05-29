// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import styled from 'styled-components';
import { FLOATING_MENU_WIDTH } from '../../constants';
import { backgroundPrimary, borderPrimary, textSecondary } from '../../theme';

export const Wrapper = styled.div<any>`
  background: ${backgroundPrimary};
  box-sizing: border-box;
  border-radius: 0.5rem;
  width: ${FLOATING_MENU_WIDTH}px;
  padding: 0.5rem 1rem;
  display: flex;
  flex-flow: column wrap;
  transition: opacity 0.1s;
  box-shadow: 1px 1px 1px ${borderPrimary};

  > button:last-child {
    border: none;
  }
`;

export const ItemWrapper = styled.button`
  border-bottom: 1px solid ${borderPrimary};
  box-sizing: border-box;
  display: flex;
  width: 100%;
  padding: 0.75rem 0.5rem;
  display: flex;
  flex-flow: row wrap;
  align-items: center;
  color: ${textSecondary};

  &:hover {
    opacity: 0.75;
  }

  .title {
    color: ${textSecondary};
    padding: 0 0 0 0.75rem;
    font-size: 1rem;
  }
`;
