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

  > button {
    margin-bottom :0.75rem;
  }
`;

const Wrapper = styled(motion.button) <any>`
  flex-grow: 1;
  background: ${props => props.type === 'default' ? '#f1f1f1' : '#d33079'};
  padding: 0.6rem 1.2rem;
  border-radius: 1.1rem;
  margin: ${props => props.margin};
  font-size: 0.95rem;
  font-variation-settings: 'wght' 560;
  color: ${props => props.type === 'default' ? '#222' : '#fafafa'};
`;

export const Button = (props: any) => {

  let { title, primary, inline, onClick } = props;
  primary = primary === undefined ? false : primary;
  inline = inline === undefined ? false : inline;

  return (
    <Wrapper
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      type={primary === true ? 'invert' : 'default'}
      margin={inline ? '0' : '0 0.5rem'}
      onClick={() => onClick()}
    >
      {title}
    </Wrapper>
  )
}

export default Button;