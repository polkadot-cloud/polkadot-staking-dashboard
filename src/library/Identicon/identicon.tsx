// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import classNames from 'classnames';
import { useCallback } from 'react';
import type { Circle } from './circles';
import { getCircleXY, OUTER_CIRCLE, renderCircle, Z } from './circles';
import { getColors } from './colors';

export interface IdenticonProps {
  size: number;
  disableCursorCopy?: boolean;
  disableClipboardCopy?: boolean;
  colors?: string[];
  value: string;
}

export const Identicon = ({
  size,
  value,
  disableCursorCopy = false,
  disableClipboardCopy = false,
  colors: initialColors,
}: IdenticonProps) => {
  const xy = getCircleXY();

  const defaultColors =
    initialColors || new Array<string>(xy.length).fill('#ddd');

  const colors = value ? initialColors || getColors(value) : defaultColors;

  const copyToClipboard = useCallback(() => {
    if (disableClipboardCopy) {
      return;
    }
    if (navigator) {
      navigator.clipboard.writeText(value);
    }
  }, [value]);

  return (
    <div
      aria-hidden="true"
      onClick={() => copyToClipboard}
      className={classNames({
        'cursor-copy': !(disableCursorCopy || disableClipboardCopy),
      })}
    >
      <svg
        height={size}
        id={value}
        name={value}
        viewBox="0 0 64 64"
        width={size}
      >
        {[OUTER_CIRCLE]
          .concat(
            xy.map(
              ([cx, cy], index): Circle => ({
                cx,
                cy,
                fill: colors[index],
                r: Z,
              })
            )
          )
          .map(renderCircle)}
      </svg>
    </div>
  );
};
