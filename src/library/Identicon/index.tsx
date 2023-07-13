// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useCallback } from 'react';
import { getCircleXY, OUTER_CIRCLE, renderCircle, Z } from './circles';
import { getColors } from './colors';
import type { Circle, IdenticonProps } from './types';
import { Wrapper } from './Wrapper';

export const Identicon = ({
  size,
  value,
  disableCursorCopy = true,
  disableClipboardCopy = true,
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
    <Wrapper
      $disableCursorCopy={disableCursorCopy}
      $disableClipboardCopy={disableClipboardCopy}
    >
      <div aria-hidden="true" onClick={() => copyToClipboard} className="copy">
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
    </Wrapper>
  );
};
