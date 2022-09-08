// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  textSecondary,
  buttonSecondaryBackground,
  networkColor,
  networkColorSecondary,
} from 'theme';
import { ButtonProps, ButtonWrapperProps } from './types';

export const ButtonRow = styled.div<{ verticalSpacing?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  margin-top: ${(props) => (props.verticalSpacing ? '1rem' : 0)};
`;

export const Wrapper = styled(motion.div)<ButtonWrapperProps>`
  display: inline-block;
  margin: ${(props) => props.margin};

  > button {
    display: flex;
    flex-flow: row wrap;
    align-items: center;
    background: ${(props) =>
      props.type === 'invert-primary'
        ? networkColor
        : props.type === 'invert-secondary'
        ? networkColorSecondary
        : buttonSecondaryBackground};
    color: ${(props) =>
      props.type === 'invert-primary' || props.type === 'invert-secondary'
        ? 'white'
        : textSecondary};

    padding: ${(props) => props.padding};
    border-radius: 0.75rem;
    font-size: ${(props) => props.fontSize};
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

export const Button = (props: ButtonProps) => {
  let { transform } = props;
  const { primary, secondary, icon, title, disabled, small, inline } = props;
  const { onClick } = props;

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
      padding={small ? '0.4rem 0.8rem' : '0.52rem 1.2rem'}
      fontSize={small ? '1rem' : '1.15rem'}
    >
      <button
        type="button"
        disabled={disabled}
        onClick={() => onClick !== undefined && onClick()}
      >
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
