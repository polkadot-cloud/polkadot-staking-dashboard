// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import styled from 'styled-components';
import { motion } from 'framer-motion';
import { textSecondary, buttonSecondaryBackground } from '../../theme';

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

export const Wrapper = styled(motion.button) <any>`
  background: ${(props) => (props.type === 'default' ? buttonSecondaryBackground : 'rgba(211, 48, 121, 0.9)')};
  color: ${(props) => (props.type === 'default' ? textSecondary : 'white')};
  margin: ${(props) => props.margin};
  flex-grow: 1;
  padding: ${(props) => props.padding};
  border-radius:  0.75rem;
  font-size:${(props) => (props.fontSize ? props.fontSize : '0.95rem')};
  font-variation-settings: 'wght' 560;

  &:disabled {
    cursor: default;
    opacity: 0.5;
  }
`;

export const Button = (props: any) => {
  let {
    primary, inline, small, disabled,
  } = props;
  const { title, onClick } = props;
  primary = primary ?? false;
  inline = inline ?? false;
  small = small ?? false;
  disabled = disabled ?? false;

  return (
    <Wrapper
      disabled={disabled}
      whileHover={{ scale: !disabled ? 1.02 : 1 }}
      whileTap={{ scale: !disabled ? 0.98 : 1 }}
      type={primary === true ? 'invert' : 'default'}
      margin={inline ? '0' : '0 0.5rem'}
      padding={small ? '0.3rem 0.75rem' : '0.5rem 1.2rem'}
      onClick={() => onClick()}
    >
      {title}
    </Wrapper>
  );
};

export default Button;
