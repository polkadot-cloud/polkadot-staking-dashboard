// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { motion } from 'framer-motion';
import styled from 'styled-components';
import {
  buttonSecondaryBackground,
  networkColor,
  networkColorSecondary,
  textSecondary,
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
  margin: ${({ margin }) => margin};

  > button {
    display: flex;
    flex-flow: row nowrap;
    align-items: center;
    background: ${({ type }) =>
      type === 'invert-primary'
        ? networkColor
        : type === 'invert-secondary'
        ? networkColorSecondary
        : buttonSecondaryBackground};
    color: ${({ type }) =>
      type === 'invert-primary' || type === 'invert-secondary'
        ? 'white'
        : textSecondary};
    line-height: 1.25rem;
    padding: ${({ padding }) => padding};
    border-radius: 1.5rem;
    font-size: ${({ fontSize }) => fontSize};
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

export const Button = ({
  onClick,
  transform,
  primary,
  secondary,
  icon,
  title,
  disabled,
  small,
  inline,
}: ButtonProps) => {
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
      padding={small ? '0.42rem 0.9rem' : '0.52rem 1.2rem'}
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
