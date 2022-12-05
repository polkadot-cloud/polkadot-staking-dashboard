// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { FloatingMenuWidth } from 'consts';
import styled from 'styled-components';
import { borderPrimary, modalBackground, textSecondary } from 'theme';

export const Wrapper = styled.div`
  background: ${modalBackground};
  width: ${FloatingMenuWidth}px;
  padding: 0.25rem 0.75rem;
  display: flex;
  flex-flow: column wrap;
  transition: opacity 0.1s;
  border-radius: 0.2rem;

  > button:last-child {
    border: none;
  }
`;

export const ItemWrapper = styled.button`
  border-bottom: 1px solid ${borderPrimary};
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
