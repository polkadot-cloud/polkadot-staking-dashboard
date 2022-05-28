// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import styled from 'styled-components';
import { motion } from 'framer-motion';
import { backgroundValidator } from '../../theme';

export const Wrapper = styled(motion.div)<any>`
  padding: 0.5rem;
  display: flex;
  flex-flow: row wrap;
  width: 100%;
  height: 3.2rem;
  position: relative;
  margin: 0.5rem;

  > div {
    background: ${backgroundValidator};
    box-sizing: border-box;
    flex: 1;
    border-radius: 0.75rem;
    display: flex;
    flex-flow: row wrap;
    justify-content: flex-start;
    align-items: center;
    flex: 1;
    overflow: hidden;
    position: absolute;
    top: 0px;
    left: 0px;
    width: 100%;
    height: 100%;

    .row {
      box-sizing: border-box;
      flex: 1 0 100%;
      height: 3.2rem;
      display: flex;
      flex-flow: row nowrap;
      justify-content: flex-start;
      align-items: center;
      padding: 0.75rem 0.6rem;
    }
    svg {
      margin: 0;
    }
  }
`;

export const Identity = styled(motion.div)`
  box-sizing: border-box;
  display: flex;
  margin-left: 0.75rem;
  margin-right: 0.5rem;
  flex-flow: row wrap;
  align-items: center;
  align-content: center;
  overflow: hidden;
  flex: 1 1 100%;

  h4 {
    margin: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .status {
    margin-left: 0.75rem;

    &.active {
      color: green;
    }
    &.inactive {
      opacity: 0.4;
    }
    &.waiting {
      opacity: 0.4;
    }
  }
`;

export const Labels = styled.div`
  display: flex;
  flex-flow: row wrap;
  justify-content: flex-end;
  align-items: center;
  overflow: hidden;
  flex: 1 1 100%;

  .label {
    margin-left: 0.35rem;
    color: #aaa;

    &.warning {
      color: #d2545d;
      display: flex;
      flex-flow: row wrap;
      align-items: center;
    }
    button {
      color: #aaa;
      &:hover {
        color: #666;
      }
      &.active {
        color: rgba(211, 48, 121, 0.85);
      }
    }
  }
`;

export default Wrapper;
