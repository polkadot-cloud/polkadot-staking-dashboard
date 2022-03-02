// Copyright 2022 @rossbulat/polkadot-staking-experience authors & contributors
// SPDX-License-Identifier: Apache-2.0

import styled from 'styled-components';
import { motion } from "framer-motion";

export const ButtonRow = styled.div`
  flex: 1;
  display: flex;
  flex-flow: row wrap;
  justify-content: flex-end;
  align-items: flex-end;
  align-content: flex-end;
  height: 190px;
`;

const Wrapper = styled(motion.button)`
  flex-grow: 1;
  background: #f1f1f1;
  padding: 0.6rem 1rem;
  border-radius: 0.75rem;
  margin: 0.75rem 0 0 0.75rem;
  font-size: 1.1rem;
  font-variation-settings: 'wght' 500;
  color: #222;
`;

export const Button = (props: any) => {

  const { title } = props;

  return (
    <Wrapper
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {title}
    </Wrapper>
  )
}

export default Button;