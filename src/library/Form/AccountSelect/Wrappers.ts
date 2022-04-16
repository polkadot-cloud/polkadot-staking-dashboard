// Copyright 2022 @rossbulat/polkadot-staking-experience authors & contributors
// SPDX-License-Identifier: Apache-2.0

import styled from 'styled-components';
import { backgroundToggle, borderPrimary, buttonPrimaryBackground, textPrimary } from '../../../theme';

export const StyledDownshift = styled.div<any>`
  box-sizing: border-box;
  position: relative;
  width: 100%;
  height: ${props => props.height ? props.height : 'auto'};
  overflow: hidden;

  /* title of dropdown */ 
   .label {
    margin: 1rem 0;
    display: block;
  }
  
  /* input element of dropdown */
  .input-wrap {
    border: 1px solid ${borderPrimary};
    display: flex; 
    flex-flow: row wrap;
    align-items: center;
    box-sizing: border-box;
    border-radius: 1rem;
    padding: 0.1rem 0.75rem;
    margin: 0.25rem 0;
  }

  .input {
    border: none;
    box-sizing: border-box;
    padding-left: 0.75rem;
  }
`;

export const StyledController = styled.button<any>`
  color: ${textPrimary};
  box-sizing: border-box;
  position: absolute;
  right: 0.5rem;
  top: 0.4rem;
  width: 2.2rem;
  height: 2.2rem;
  display: flex;
  flex-flow: column wrap;
  justify-content: center;
  align-items: center;
`;

/* dropdown box for horizontal scroll */
export const StyledSelect = styled.div`
  background: ${backgroundToggle};
  position: relative;
  box-sizing: border-box;
  margin: 0.75rem 0 0;
  border-bottom: none;
  width: auto;
  border-radius: 0.75rem;
  z-index: 1;
  height: 140px;
  padding: 0.5rem;

  .items {
    width: 100%;
    height: 155px;
    overflow-y: hidden;

    display: flex;
    flex-flow: row nowrap;
    padding-bottom: 30px;
  }

  .item {
    background: ${buttonPrimaryBackground};
    box-sizing: border-box;
    width: 240px;
    height: 100%;
    padding: 0.65rem 1rem;
    cursor: pointer;
    margin: 0rem 0.37rem;
    border-radius: 0.75rem;
    display: flex;
    flex-flow: column wrap;
    justify-content: center;
    align-items: flex-start;
    flex: none;

    &:first-child {
      margin-left: 0rem;
    }
    &:last-child {
      margin-right: 0rem;
    }
    p {
      color: ${textPrimary};
      margin: 0.25rem 0 0;
    }
    .icon {
      margin-bottom: 0.7rem;
    }
  }
`;