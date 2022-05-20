// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import styled from 'styled-components';
import { motion } from 'framer-motion';
import { backgroundValidator } from '../../theme';

export const Wrapper = styled(motion.div)<any>`
  padding: 0.5rem;
  display: flex;
  flex-flow: row nowrap;
  width: 100%;
  height: 3.2rem;
  position: relative;
  margin: 0.5rem;

  > div {
    background: ${backgroundValidator};
    box-sizing: border-box;
    padding: 0.75rem 0.6rem;
    flex: 1;
    border-radius: 0.75rem;
    display: flex;
    flex-flow: row nowrap;
    justify-content: flex-start;
    align-items: center;
    flex: 1;
    overflow: hidden;
    position: absolute;
    top: 0px;
    left: 0px;
    width: 100%;
    height: 100%;

    .identity {
      box-sizing: border-box;
      display: flex;
      margin-left: 0.75rem;
      margin-right: 0.5rem;
      flex-flow: row wrap;
      align-items: center;
      align-content: center;
      overflow: hidden;
      flex: 1 1 60%;

      h4 {
        margin: 0;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
    .labels {
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
    }

    svg {
      margin: 0;
    }
  }
`;

export default Wrapper;
