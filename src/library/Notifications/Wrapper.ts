// Copyright 2022 @rossbulat/polkadot-staking-experience authors & contributors
// SPDX-License-Identifier: Apache-2.0

import styled from 'styled-components';

export const Wrapper = styled.ul`
  position: fixed;
  bottom: 30px;
  right: 0;
  display: flex;
  flex-direction: column;
  list-style: none;
  justify-content: flex-end;
  z-index: 10;

  li {
    width: 360px;
    background: white;
    margin: 0.4rem 1.2rem;
    min-height: 100px;
    position: relative;
    border-radius: 10px;
    padding: 0.25rem 1rem;
    box-sizing: border-box;
    display: flex;
    flex-flow: column wrap;
    justify-content: center;
    cursor: pointer;

    h3 {
      margin: 0.5rem 0 0.75rem; 
      font-variation-settings: 'wght' 500;
      color: #C0236A;
    }

    h4 {
      margin: 0 0 0.5rem;
      color: #444;
    }
    p { 
      font-size: 0.9rem;
    }

    &:hover {
      button.close {
        opacity: 0.6;
      }
    }
  }

  button.close {
    position: absolute;
    top: 10px;
    right: 5px;
    background: none;
    border: none;
    opacity: 0.2;
    transition: opacity 0.2s;
  }
`;

export default Wrapper;