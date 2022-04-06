// Copyright 2022 @rossbulat/polkadot-staking-experience authors & contributors
// SPDX-License-Identifier: Apache-2.0

import styled from 'styled-components';
import { motion } from "framer-motion";

export const Wrapper = styled.div`
  display: flex;
  flex-flow: column nowrap;
  justify-content: flex-start;
  padding: 0 2rem;
`;

export const ListWrapper = styled.div`
  display: flex;
  flex-flow: row wrap;
  padding-top: 1rem;
`;

export const StatBoxWrapper = styled(motion.div)`
  display: flex;
  flex-flow: column wrap;
  z-index: 0;
  flex-basis: 100%;
  flex: 1;
  flex-basis: 100%;
  margin-bottom: 1rem;

  /* responsive screen sizing */
  h2 {
    font-size: 1.2rem;
  }
  @media(min-width: 750px) {
    flex-basis: 33%;
    min-width: 200px;
    max-width: none;
    margin-bottom: 0;
  }
  
  @media(min-width: 950px) {
    max-width: 275px;
    h2 {
    font-size: 1.3rem;
    }
  }

  .content {
    border-radius: 1rem;
    background: rgba(255,255,255,0.6);
    display: flex;
    flex-flow: column wrap;
    margin-right: 1.25rem;
    padding: 1rem 0;

    @media(max-width: 749px) {
        margin-right: 0;
        padding: 0.9rem 0;
    }

    > section {
      padding: 0 1.15rem;

      &:first-child {
        flex-grow: 1;
        display: flex;
        flex-flow: column wrap;
        justify-content: flex-end;
        
        h2 {
          margin: 0;
          padding: 0.2rem 0 1rem 0;
        }
      }
      &:last-child {
        h4 {
        margin: 0;
      }
    }
  }
}
`;

export default Wrapper;