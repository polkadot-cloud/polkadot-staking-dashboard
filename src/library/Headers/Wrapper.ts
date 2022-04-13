// Copyright 2022 @rossbulat/polkadot-staking-experience authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { motion } from "framer-motion";
import styled from 'styled-components';
import { SIDE_MENU_STICKY_THRESHOLD } from '../../constants';

export const Wrapper = styled.div`
  position: sticky;
  top: 0px;
  right: 0px;
  display: flex;
  flex-flow: row wrap;
  justify-content: flex-end;
  align-items: center;
  align-content: center;
  padding: 0.75rem  1rem; 
  transition: all 0.15s;
  z-index: 5;
  margin-bottom: 0.5rem;


  /* overwrite default cursor behaviour for Identicon  */
  svg, .ui--IdentityIcon {
    cursor: default;
  }

  .menu {
    display: none;
    @media(max-width: ${SIDE_MENU_STICKY_THRESHOLD}px) {
      display: flex;
      flex-flow: row wrap;
      justify-content: flex-start;
      align-items: center;
      flex-grow: 1;
    }
  }
`;

export const HeadingWrapper = styled.div`
  display: flex;
  flex-flow: row wrap;
  justify-content: flex-end;
  margin-left: 0.75rem;
  position: relative;

  &:first-child {
    margin-left: 0;
  }

  /* accounts dropdown */
  .accounts {
    position: absolute;
    border-radius: 1rem;
    background: rgba(237,237,237,0.4);
    backdrop-filter: blur(4px);
    top: 3rem;
    right: 0;
    width: 100%;
    min-width: 250px;
    list-style: none;
    margin: 0;
    padding: 0rem 0.25rem;
    display: flex;
    flex-flow: column wrap;
    box-sizing: border-box;

    > button {
      margin: 0.25rem 0;
    }
  }
`;

export const Item = styled(motion.button)`
    flex-grow: 1;  
    padding: 0 1rem;
    border-radius: 1rem;
    box-shadow: none;
    background: rgb(237, 237, 237);
    display: flex;
    flex-flow: row nowrap;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    font-variation-settings: 'wght' 540;
    font-size: 1rem;

    > span {
      line-height: 2.2rem;
    }

    &.connect {
      background: #d33079;
      color: white;
    }
    .label {
      border: 0.125rem solid #d33079;
      border-radius: 0.8rem;
      color: #d33079;
      font-size: 0.85rem;
      font-variation-settings: 'wght' 525;
      margin-right: 0.6rem;
      padding: 0.1rem 0.5rem;
    }
`;

export const ItemInactive = styled(motion.div)`
    flex-grow: 1;  
    padding: 0 1rem;
    border-radius: 1rem;
    background: rgb(237, 237, 237);
    display: flex;
    flex-flow: column nowrap;
    justify-content: center;
    align-items: center;
    font-variation-settings: 'wght' 540;
    font-size: 1rem;

    > span {
      line-height: 2.2rem;
    }
`;

export default Wrapper;