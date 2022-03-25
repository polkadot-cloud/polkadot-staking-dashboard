// Copyright 2022 @rossbulat/polkadot-staking-experience authors & contributors
// SPDX-License-Identifier: Apache-2.0

import styled from 'styled-components';
import { motion } from "framer-motion";

export const Wrapper = styled.div`
  display: flex;
  flex-flow: column nowrap;
  overflow-x: auto;
  flex-shrink: 0;
  padding: 0 2rem;
`;

export const ListWrapper = styled.div`
  height: 100px;
  display: flex;
  flex-flow: row nowrap;
  overflow-x: auto;
  padding-bottom: 1rem;
  overflow: hidden;
`;

export const Scrollable = styled.div`
  display: flex;
  flex-flow: row nowrap;
  overflow-x: auto;
  padding: 1rem 0;
  height: 100%;
  flex: 1;
`;

export const StatBoxWrapper = styled(motion.div)`
  border-radius: 1rem;
  margin-right: 1.25rem;
  flex-basis: 33%;
  min-width: 250px;
  max-width: 275px;
  flex-grow: 1;
  flex-shrink: 0;
  background: rgba(255,255,255,0.5);
  display: flex;
  flex-flow: column wrap;
  overflow: hidden;
  z-index: 0;

  > section {
    padding: 0 1.15rem;

    &:first-child {
      flex-grow: 1;
      display: flex;
      flex-flow: column wrap;
      justify-content: flex-end;
      h1 {
        margin: 0;
        padding: 0.85rem 0;
      }
    }
    &:last-child {
      h4 {
      margin: 0;
      padding-bottom: 1.3rem;
      opacity: 0.8;
    }
  }
}
`;

export default Wrapper;