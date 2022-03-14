// Copyright 2022 @rossbulat/polkadot-staking-experience authors & contributors
// SPDX-License-Identifier: Apache-2.0

import styled from "styled-components";
import { motion } from "framer-motion";

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
    flex-grow: 1;
    flex-basis: 50%;
  }
`;

export default List;