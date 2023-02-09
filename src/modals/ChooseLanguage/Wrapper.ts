// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import styled from 'styled-components';
import { backgroundToggle, buttonPrimaryBackground } from 'theme';

export const ContentWrapper = styled.div`
  box-sizing: border-box;
  width: 100%;

  .items {
    box-sizing: border-box;
    position: relative;
    box-sizing: border-box;
    border-bottom: none;
    width: auto;
    border-radius: 0.75rem;
    overflow: hidden;
    overflow-y: auto;
    z-index: 1;
    width: 100%;
    margin: 1rem 0 1.5rem 0;
  }
`;

export const LocaleButton = styled.button<any>`
  background: ${buttonPrimaryBackground};
  box-sizing: border-box;
  padding: 1rem;
  cursor: pointer;
  border-radius: 0.75rem;
  display: inline-flex;
  flex-flow: row wrap;
  align-items: center;
  width: 100%;
  border: 1px solid var(--status-success-color-transparent);
  ${(props) =>
    props.connected !== true &&
    `
  border: 1px solid rgba(0,0,0,0);
`}
  h4 {
    margin: 0;
    &.selected {
      color: var(--text-color-success);
      margin-left: 0.75rem;
    }
  }
  &:hover {
    background: ${backgroundToggle};
  }
`;
