// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { SECTION_FULL_WIDTH_THRESHOLD } from 'consts';
import styled from 'styled-components';
import {
  backgroundToggle,
  textPrimary,
  networkColor,
  textSecondary,
} from 'theme';

export const Items = styled.div`
  position: relative;
  box-sizing: border-box;
  margin: 0.75rem 0 0;
  width: 100%;
  border-radius: 0.75rem;
  padding: 0.25rem;
  overflow: auto;
  display: flex;
  flex-flow: row wrap;
  flex: 1;
`;

export const Item = styled.button<{ selected?: boolean }>`
  box-sizing: border-box;
  flex-basis: 33%;
  @media (max-width: ${SECTION_FULL_WIDTH_THRESHOLD}px) {
    flex-basis: 100%;
  }

  > div {
    box-sizing: border-box;
    background: ${backgroundToggle};
    border: 2px solid
      ${(props) => (props.selected ? networkColor : backgroundToggle)};
    width: 100%;
    border-radius: 0.9rem;
    display: flex;
    flex-flow: row wrap;
    justify-content: flex-start;
    align-items: center;
    margin: 0.35rem;
    padding: 1.25rem;

    > div {
      width: 100%;
    }
    h3 {
      color: ${(props) => (props.selected ? networkColor : textPrimary)};
      font-size: 1.2rem;
    }
    &:first-child {
      margin-left: 0rem;
    }
    &:last-child {
      margin-right: 0rem;
    }
    p {
      color: ${textSecondary};
      margin: 0.75rem 0 0 0;
      text-align: left;
    }
  }
`;
