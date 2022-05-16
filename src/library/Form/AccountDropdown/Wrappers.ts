// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import styled from 'styled-components';
import { borderPrimary, textPrimary, backgroundDropdown } from '../../../theme';

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

  /* input element of dropdown */
  .input {
    border: none;
    box-sizing: border-box;
    padding-left: 0.75rem;
    flex: 1;
  }
`;

export const StyledController = styled.button<any>`
  color: ${textPrimary};
  box-sizing: border-box;
  border: none;
  position: absolute;
  right: 0.5rem;
  top: 0.4rem;
  width: 2.2rem;
  height: 2.2rem;
  display: flex;
  flex-flow: column wrap;
  justify-content: center;
  align-items: center;
  border-radius: 0.5rem;
`;

/* dropdown box for vertical scroll */
export const StyledDropdown = styled.div`
  background: ${backgroundDropdown};
  position: relative;
  box-sizing: border-box;
  margin: 0.5rem 0 0;
  border-bottom: none;
  width: auto;
  height: 14rem;
  border-radius: 0.75rem;
  overflow: auto;
  z-index: 1;

  .item {
    box-sizing: border-box;
    padding: 0.5rem;
    cursor: pointer;
    margin: 0.25rem;
    border-radius: 0.75rem;
    display: flex;
    flex-flow: row wrap;
    justify-content: flex-start;
    align-items: center;
     
    .icon {
      margin-right: 0.5rem;
    }
    p {
      font-size: 1rem;
      color: ${textPrimary};
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
      flex: 1;
    }
  }
`;