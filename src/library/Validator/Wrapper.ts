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
    background: linear-gradient(90deg, rgba(242,242,242,1) 0%, rgba(242,242,242,0.6) 100%);
    border-radius: 0.75rem;
    display: flex;
    flex-flow: row nowrap;
    overflow: hidden;
    justify-content: flex-start;
    align-items: center;
    overflow-x: auto;

    .identity {
      display: flex;
      margin-left: 0.75rem;
      margin-right: 0.25rem;
      display: flex;
      flex-flow: row nowrap;
      align-items: center;
      align-content: center;
      overflow: hidden;
      flex: 1;
    }
    .labels {
      display: flex;
      flex-flow: row wrap;
      justify-content: flex-end;
      align-items: center;
      flex-grow: 1;

      label {
        border-radius: 0.6rem;
        color: #aaa;
        margin-left: 0.75rem;
      }
    }

    h4 {
      margin: 0;
      width: 100%;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
`;

export default Wrapper;