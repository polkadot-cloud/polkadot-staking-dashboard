// Copyright 2022 @rossbulat/polkadot-staking-experience authors & contributors
// SPDX-License-Identifier: Apache-2.0

import styled from 'styled-components';
import { motion } from 'framer-motion';

export const FiltersWrapper = styled.div`
  width: 100%;
  padding: 0.25rem 0.5rem 1rem 0.5rem;
  display: flex;
  flex-flow: row wrap;
  justify-content: flex-start;
  align-items: flex-end;

  > .separator {
    border-right: 1px solid #e1e1e1;
    width: 1px;
    height: 80px;
    margin: 0 1rem;
  }

  > .section {
    display: flex;
    flex-flow: column wrap;
    justify-content: flex-start;

    > .head {
      flex: 1;
      padding-bottom: 0.6rem;
      font-size: 0.8rem;
      color: #666;
    }

    > .items {
      flex: 1;
      display: flex;
      flex-flow: row wrap;
      justify-content: flex-start;
    }
  }
`;

export const Item = styled(motion.button)`
    width: 120px;
    height: 80px;
    border-radius: 0.75rem;
    /* background: rgba(211, 48, 121, 0.85); */
    background: #f4f4f4;
    display: flex;
    flex-flow: column nowrap;
    margin-right: 1rem;

    &:last-child {
      margin-right: 0;
    }

    > div {
      display: flex;
      flex-flow: row wrap;
      padding-left: 0.5rem;
      padding-right: 0.5rem;
      width: 100%;

      &:first-child { 
        flex-grow: 1;
        flex-basis: 70%;
        justify-content: flex-start;
        align-items: flex-end;
        padding-bottom: 0.6rem;
        
        .icon {
          display: flex;
          flex-flow: column wrap;
          justify-content: center;
          align-items: center;
          padding: 0 0.5rem;
        }
      }

      &:last-child {
      justify-content: flex-start;
      padding-top: 0.2rem;
      flex-basis: 30%;
      min-height: 40px;
      display: flex;
      flex-flow: column wrap;
      justify-content: flex-start;

      p {
        color: #999;
        font-size: 0.85rem;
        margin: 0;
        text-align: left;
        font-variation-settings: 'wght' 550;
        padding-top: 0.15rem;
      }
    }
  }   
`;

export default FiltersWrapper;