// Copyright 2022 @rossbulat/polkadot-staking-experience authors & contributors
// SPDX-License-Identifier: Apache-2.0

import styled from 'styled-components';
import { motion } from "framer-motion";

export const Wrapper = styled(motion.div) <any>`
  width: 100%;
  border-top: 1px solid #e1e1e1;
  display: flex;
  flex-flow: column nowrap;
  justify-content: flex-start;
  align-items: center;
  font-size: 0.75rem;
  color: #444;
  position: relative;
  overflow: hidden;
`;

export const Summary = styled.div`
  width: 100%;
  display: flex;
  flex-flow: row nowrap;
  justify-content: flex-start;
  align-items: center;
  align-content: center;

  p {
    margin: 0 0.25rem;
    color: #666;
  }
  .stat {
    margin: 0 0.25rem;
    display: flex;
    flex-flow: row nowrap;
    align-items: center;
  }

  /* left and right sections for each row*/
  > section {
    padding: 0.5rem 0.5rem;

    /* left section */
    &:nth-child(1) {
      display: flex;
      flex-flow: row wrap;
      align-items: center;
      flex-grow: 1;
      .network_icon {
        margin-right: 0.5rem;
        width: 1.5rem;
        height: 1.5rem;
      }
    }

    /* right section */
    &:last-child {
      flex-grow: 1;
      display: flex;
      align-items: center;
      flex-flow: row-reverse wrap;
      button {
        background: #eee;
        border-radius: 0.4rem;
        padding: 0.25rem 0.5rem;
        color: #444;
      }
      span {
        &.pos { color: #3eb955; }
        &.neg { color: #d2545d; }
      }
    }
  }
`;

export const NetworkInfo = styled(motion.div)`
  width: 100%;
  background: #d33079;
  flex: 1;
  box-sizing: border-box;
  display: flex;
  flex-flow: column nowrap;
  justify-content: flex-start;
  align-content: flex-start;
  padding: 0.25rem 1rem 1.25rem 1rem;
  overflow: auto;

  > .row {
    display: flex;
    flex-flow: row nowrap;
    justify-content: flex-start;
    align-content: flex-start;
    align-items: flex-start;

    > h3 {
      color: #eee;
      font-size: 0.85rem;
      margin: 1.5rem 0 0.75rem 0;
      padding: 0.6rem 0.3rem 0rem;
      border-top: 1px solid rgba(255,255,255,0.1);
      width: 100%;
    }

    > div, > button {
      padding: 0.25rem 1.5rem 0.25rem;
      background: rgba(0,0,0,0.1);
      margin-right: 1rem;
      border-radius: 0.5rem;
      padding: 0.5rem 1.25rem;
      display: flex;
      flex-flow: column nowrap;

      &:last-child {
        margin-right: 0;
      }
    }
    p {
      margin: 0;
      font-size: 0.85rem;
      font-variation-settings: 'wght' 500;
      color: #f1f1f1;
      padding: 0.2rem 0;

      &.val {
        font-size: 0.85rem;
        color: #e6e6e6;
      }
    }
  }

  > .row:first-child > h3 {
      margin-top: 0.5rem;
      border-top: 0;
    }
`;

export const Separator = styled.div`
  border-left: 1px solid #ccc;
  margin: 0 0.3rem;
  width: 1px;
  height: 1rem;
`;

export const ConnectionSymbol = styled.div<any>`
  width: 10px;
  height: 10px;
  background: ${props => props.color};
  border-radius: 50%;
  margin: 0 0.7rem;
`;

export default Wrapper;