// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import styled from 'styled-components';
import {
  backgroundToggle,
  buttonPrimaryBackground,
  textPrimary,
  textSecondary,
  borderPrimary,
  textSuccess,
  successTransparent,
} from 'theme';
import { NetworkButtonProps } from './types';

export const Wrapper = styled.div`
  display: flex;
  flex-flow: column wrap;
  align-items: center;
  justify-content: flex-start;
  padding: 1rem;

  h2 {
    margin-top: 0.5rem;
    color: ${textPrimary};
  }
`;

export const ContentWrapper = styled.div`
  box-sizing: border-box;
  width: 100%;

  > h4 {
    color: ${textSecondary};
    margin: 0.75rem 0;
    padding-bottom: 0.5rem;
    width: 100%;
    border-bottom: 1px solid ${borderPrimary};
  }

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

    h4 {
      margin: 0.2rem 0;
    }
    h2 {
      margin: 0.75rem 0;
    }
  }
`;

export const NetworkButton = styled.button<NetworkButtonProps>`
  background: ${buttonPrimaryBackground};
  box-sizing: border-box;
  padding: 1rem;
  cursor: pointer;
  margin-bottom: 1rem;
  border-radius: 0.75rem;
  display: inline-flex;
  flex-flow: row wrap;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  border: 1px solid ${successTransparent};
  ${(props) =>
    props.connected !== true &&
    `
    border: 1px solid rgba(0,0,0,0);
  `}

  &:last-child {
    margin-bottom: 0;
  }

  h3 {
    margin: 0 0.5rem;
  }

  h4 {
    margin: 0;
    &.selected {
      color: ${textSuccess};
      margin-left: 0.75rem;
    }
  }

  > *:last-child {
    flex: 1;
    display: flex;
    flex-flow: row wrap;
    justify-content: flex-end;
  }
  &:hover {
    background: ${backgroundToggle};
  }
  .icon {
    margin-right: 0.5rem;
  }

  svg {
    color: ${textSecondary};
    fill: ${textSecondary};
  }
  p {
    color: ${textPrimary};
    font-size: 1rem;
  }
`;

export const BraveWarning = styled.div`
  display: flex;
  border: 1px solid ${borderPrimary};
  border-radius: 0.75rem;
  padding: 1rem;

  .brave-text {
    width: 90%;
    padding-left: 1rem;
    color: ${textPrimary};
    font-size: 1.2rem;
    align-self: center;

    .learn-more {
      color: ${textSecondary};
      font-weight: bold;
      text-decoration: underline ${borderPrimary};
    }
  }
`;

export const ConnectionsWrapper = styled.div`
  display: flex;
  flex-flow: row wrap;
  align-items: center;
  margin-top: 1rem;
  margin-bottom: 1.5rem;
`;

export const ConnectionButton = styled.button<NetworkButtonProps>`
  background: ${buttonPrimaryBackground};
  padding: 0.75rem 0.75rem;
  margin-right: 0.5rem;
  border-radius: 0.5rem;
  border: 1px solid ${successTransparent};
  ${(props) =>
    props.connected !== true &&
    `
    border: 1px solid rgba(0,0,0,0);
  `}
  display: inline-flex;
  flex-flow: row wrap;
  justify-content: flex-start;
  align-items: center;

  &:hover {
    background: ${backgroundToggle};
  }

  > h3 {
    margin: 0 0.75rem;
  }
  h4 {
    margin: 0;
    &.selected {
      color: ${textSuccess};
      margin: 0 0.75rem 0 0;
    }
  }
`;
