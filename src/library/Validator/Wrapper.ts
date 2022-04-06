// Copyright 2022 @rossbulat/polkadot-staking-experience authors & contributors
// SPDX-License-Identifier: Apache-2.0

import styled from 'styled-components';
import { motion } from 'framer-motion';

export const Wrapper = styled(motion.div) <any>`
  padding: 0.5rem;
  display: flex;
  flex-flow: row nowrap;
  width: 100%;

  > div {
    padding: 0.75rem 0.6rem;
    flex: 1;
    background: linear-gradient(90deg, rgba(240,240,240,1) 0%, rgba(240,240,240,0.7) 100%);
    border-radius: 0.75rem;
    display: flex;
    flex-flow: row nowrap;
    justify-content: flex-start;
    align-items: center;
    flex: 1;
    max-width: 100%;

    .identity {
      display: flex;
      margin-left: 0.75rem;
      margin-right: 0.5rem;
      flex-flow: row nowrap;
      align-items: center;
      align-content: center;
      overflow: hidden;
      flex-shrink: 1;
      flex-grow: 1;
    }
    .labels {
      display: flex;
      flex-flow: row nowrap;
      justify-content: flex-end;
      align-items: center;
      flex: 1;

      label {
        margin-left: 0.5rem;
        color: #aaa;
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

    svg { margin: 0; }
    h4 {
      margin: 0;
      flex: 1;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
`;

export default Wrapper;