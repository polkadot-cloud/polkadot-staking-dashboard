// Copyright 2022 @rossbulat/polkadot-staking-experience authors & contributors
// SPDX-License-Identifier: Apache-2.0

import styled from 'styled-components';

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
  .input {
    box-sizing: border-box;
    width: 100%;
  }
`;

export const StyledController = styled.button<any>`
  box-sizing: border-box;
  border: none;
  position: absolute;
  right: 0;
  top: 0;
  width: 2.2rem;
  height: 2.2rem;
  display: flex;
  flex-flow: column wrap;
  justify-content: center;
  align-items: center;
  background: #f7f7f7;
  border-radius: 0.5rem;
`;

/* dropdown box for vertical scroll */
export const StyledDropdown = styled.div`
  position: relative;
  box-sizing: border-box;
  margin: 0.5rem 0 0;
  border-bottom: none;
  width: auto;
  height: 14rem;
  background: #fafafa;
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
    transition: background 0.1s;

    .icon {
      margin-right: 0.5rem;
    }
  }
`;