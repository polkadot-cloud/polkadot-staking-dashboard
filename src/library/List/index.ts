// Copyright 2022 @rossbulat/polkadot-staking-experience authors & contributors
// SPDX-License-Identifier: Apache-2.0

import styled from "styled-components";
import { motion } from "framer-motion";

export const Wrapper = styled.div`
  display: flex;
  width: 100%;
  flex-flow: column nowrap;
`;

export const Header = styled.div`
  display: flex;
  flex-flow: row wrap;
  justify-content: flex-end;
  padding: 0 0.25rem 0.5rem 0.25rem;
  flex: 1;
  border-bottom: 1px solid #eee;
  
  > div {
    display: flex; 
    flex-flow: row nowrap;
    align-items: center;
  }

  > div:first-child {
    justify-content: flex-start;
  }

  > div:last-child {
    justify-content: flex-end;
    flex: 1;    

    button {
      font-size: 1.1rem;
      margin-left: 0.4rem;
      opacity: 0.6;
      transition: all 0.2s;

      &:hover {
        opacity: 0.9
      }
    }
  }
`;


export const List = styled(motion.div)`
  margin-top: 1rem;
  display: flex;
  flex-flow: row wrap;
  justify-content: flex-start;
  align-items: flex-start;
  width: 100%;

  > .item {
    display: flex;
    flex-flow: row nowrap;
    align-items: center;

    &.row {
      flex-basis: 100%;
    }

    &.col {
      flex-basis: 50%;
    }
  }
`;

export default List;