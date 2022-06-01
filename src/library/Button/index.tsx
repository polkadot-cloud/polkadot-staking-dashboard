// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  textSecondary,
  buttonSecondaryBackground,
  secondary as secondaryColor,
} from 'theme';

export const ButtonRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
`;

export const Wrapper = styled(motion.div)<any>`
  display: inline-block;
  margin: ${(props) => props.margin};

  > button {
    display: flex;
    flex-flow: row wrap;
    align-items: center;
    background: ${(props) =>
      props.type === 'invert-primary'
        ? 'rgba(211, 48, 121, 0.9)'
        : props.type === 'invert-secondary'
        ? secondaryColor
        : buttonSecondaryBackground};
    color: ${(props) =>
      props.type === 'invert-primary' || props.type === 'invert-secondary'
        ? 'white'
        : textSecondary};

    padding: ${(props) => props.padding};
    border-radius: 0.75rem;
    font-size: ${(props) => props.fontSize};
    font-variation-settings: 'wght' 560;
    transition: opacity 0.2s;

    .space {
      margin-right: 0.6rem;
    }

    &:disabled {
      cursor: default;
      opacity: 0.25;
    }
  }
`;

export const Button = (props: any) => {
  let { primary, secondary, inline, small, disabled, icon, transform, title } =
    props;
  const { onClick } = props;
  title = title ?? false;
  primary = primary ?? false;
  secondary = secondary ?? false;
  inline = inline ?? false;
  small = small ?? false;
  disabled = disabled ?? false;
  icon = icon ?? false;
  transform = transform ?? 'shrink-1';

  const type = primary
    ? 'invert-primary'
    : secondary
    ? 'invert-secondary'
    : 'default';

  return (
    <Wrapper
      whileHover={{ scale: !disabled ? 1.02 : 1 }}
      whileTap={{ scale: !disabled ? 0.98 : 1 }}
      type={type}
      margin={inline ? '0' : '0 0.5rem'}
      padding={small ? '0.36rem 0.8rem' : '0.45rem 1.2rem'}
      fontSize={small ? '0.95rem' : '1.05rem'}
    >
      <button type="button" disabled={disabled} onClick={() => onClick()}>
        {icon && (
          <FontAwesomeIcon
            icon={icon}
            className={title ? 'space' : undefined}
            transform={transform}
          />
        )}
        {title && title}
      </button>
    </Wrapper>
  );
};

export default Button;
