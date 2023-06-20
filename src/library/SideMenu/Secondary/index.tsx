// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ForwardRefComponent, HTMLMotionProps } from 'framer-motion';
import type { IStyledComponent } from 'styled-components';
import type { SecondaryProps } from '../types';
import { IconWrapper, MinimisedWrapper, Wrapper } from './Wrappers';

export const Secondary = ({
  action,
  classes,
  name,
  icon,
  minimised,
  onClick,
}: SecondaryProps) => {
  const { Svg, size } = icon || {};

  const StyledWrapper: IStyledComponent<
    'web',
    ForwardRefComponent<HTMLButtonElement, HTMLMotionProps<'button'>>,
    object,
    never
  > = minimised ? MinimisedWrapper : Wrapper;

  return (
    <StyledWrapper
      className={classes ? classes.join(' ') : undefined}
      onClick={() => {
        onClick();
      }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{
        duration: 0.1,
      }}
    >
      <IconWrapper
        $minimised={minimised}
        className="icon"
        style={{ width: size, height: size }}
      >
        {Svg && <Svg width={size} height={size} />}
      </IconWrapper>

      {!minimised && (
        <>
          <div className="name">{name}</div>
          {action && <div className="action">{action}</div>}
        </>
      )}
    </StyledWrapper>
  );
};
