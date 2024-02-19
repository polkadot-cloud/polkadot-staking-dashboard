// Copyright 2024 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { MouseEvent } from 'react';
import type { AnyJson } from 'types';

// Formats mouse handlers for buttons given its props.
export const onMouseHandlers = (props: AnyJson) => {
  const { onClick, onMouseOver, onMouseMove, onMouseOut } = props;
  return {
    onClick:
      typeof onClick == 'function'
        ? (e: MouseEvent<HTMLButtonElement>) => onClick(e)
        : undefined,
    onMouseOver:
      typeof onMouseOver == 'function'
        ? (e: MouseEvent<HTMLButtonElement>) => onMouseOver(e)
        : undefined,
    onMouseMove:
      typeof onMouseMove == 'function'
        ? (e: MouseEvent<HTMLButtonElement>) => onMouseMove(e)
        : undefined,
    onMouseOut:
      typeof onMouseOut == 'function'
        ? (e: MouseEvent<HTMLButtonElement>) => onMouseOut(e)
        : undefined,
  };
};
