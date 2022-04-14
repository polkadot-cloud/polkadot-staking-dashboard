// Copyright 2022 @rossbulat/polkadot-staking-experience authors & contributors
// SPDX-License-Identifier: Apache-2.0

import styled from 'styled-components';
import { motion } from "framer-motion";
import { textPrimary, buttonPrimaryBackground } from '../../theme';

export const ButtonRow = styled.div`
  flex: 1;
  display: flex;
  flex-flow: row wrap;
  justify-content: flex-end;
  align-items: flex-end;
  align-content: flex-end;

  > button {
    margin-top :0.5rem;
  }
`;

const Wrapper = styled(motion.button) <any>`
  background: ${props => props.type === 'default' ? buttonPrimaryBackground : 'rgba(211, 48, 121, 0.9)'};
  color: ${props => props.type === 'default' ? textPrimary : 'white'};
  margin: ${props => props.margin};
  flex-grow: 1;
  padding: ${props => props.padding};
  border-radius: 1rem;
  font-size: 0.95rem;
  font-variation-settings: 'wght' 560;
`;

export const Button = (props: any) => {

  let { title, primary, inline, thin, onClick } = props;
  primary = primary ?? false;
  inline = inline ?? false;
  thin = thin ?? false;

  return (
    <Wrapper
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      type={primary === true ? 'invert' : 'default'}
      margin={inline ? '0' : '0 0.5rem'}
      padding={thin ? '0.32rem 1.2rem' : '0.5rem 1.2rem'}
      onClick={() => onClick()}
    >
      {title}
    </Wrapper>
  )
}

export default Button;